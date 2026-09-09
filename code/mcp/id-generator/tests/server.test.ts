import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { createServer } from "../src/server.js";

let client: Client;
let handler: ReturnType<typeof createMcpHandler>;

beforeEach(async () => {
  handler = createMcpHandler(createServer);
  const transport = new StreamableHTTPClientTransport(new URL("http://test.local/mcp"), {
    fetch: (url, init) => handler.fetch(new Request(url, init)),
  });
  client = new Client(
    { name: "test-harness", version: "1.0.0" },
    { versionNegotiation: { mode: "auto" } },
  );
  await client.connect(transport);
});

afterEach(async () => {
  await client.close();
  await handler.close();
});

test("listTools advertises the four action tools", async () => {
  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name).sort();
  assert.deepEqual(names, ["id_explain", "id_generate", "id_list_algorithms", "id_recommend"]);
});

test("listResources includes catalog, decision-tree, and implemented algorithms", async () => {
  const { resources } = await client.listResources();
  const uris = resources.map((r) => r.uri);
  assert.ok(uris.includes("idgen://catalog"));
  assert.ok(uris.includes("idgen://decision-tree"));
  assert.ok(uris.includes("idgen://algorithms/entropy_id"));
  assert.ok(uris.includes("idgen://algorithms/mist_id"));
});

test("read catalog is JSON with 39 algorithms", async () => {
  const { contents } = await client.readResource({ uri: "idgen://catalog" });
  assert.equal(contents[0].mimeType, "application/json");
  const parsed = JSON.parse((contents[0] as { text: string }).text);
  assert.equal(parsed.length, 39);
});

test("read decision-tree is markdown with official defaults", async () => {
  const { contents } = await client.readResource({ uri: "idgen://decision-tree" });
  const text = (contents[0] as { text: string }).text;
  assert.match(text, /entropy_id/);
  assert.match(text, /uuid_v7/);
  assert.match(text, /mist_id/);
});

test("read algorithms/entropy_id", async () => {
  const { contents } = await client.readResource({ uri: "idgen://algorithms/entropy_id" });
  const algo = JSON.parse((contents[0] as { text: string }).text);
  assert.equal(algo.slug, "entropy_id");
  assert.equal(algo.coordination, "none");
});

test("getPrompt choose-id embeds the decision tree and asks for id_recommend", async () => {
  const result = await client.getPrompt({
    name: "choose-id",
    arguments: { output: "long", coordination: "none" },
  });
  assert.equal(result.messages.length, 2);
  const embedded = result.messages[0].content;
  assert.equal(embedded.type, "resource");
  const text = result.messages[1].content;
  assert.equal(text.type, "text");
  if (text.type === "text") {
    assert.match(text.text, /id_recommend/);
  }
});

test("getPrompt choose-id accepts string boolean flags", async () => {
  const result = await client.getPrompt({
    name: "choose-id",
    arguments: { output: "long", coordination: "none", js_safe: "true" },
  });
  const text = result.messages[1].content;
  assert.equal(text.type, "text");
  if (text.type === "text") {
    assert.match(text.text, /js_safe=true/);
  }
});

test("getPrompt generate-samples instructs id_generate", async () => {
  const result = await client.getPrompt({
    name: "generate-samples",
    arguments: { algorithm: "uuid_v7", count: "3" },
  });
  const content = result.messages[0].content;
  assert.equal(content.type, "text");
  if (content.type === "text") {
    assert.match(content.text, /id_generate/);
    assert.match(content.text, /uuid_v7/);
  }
});

test("callTool id_recommend shared long -> mist_id", async () => {
  const result = await client.callTool({
    name: "id_recommend",
    arguments: { coordination: "shared", output: "long" },
  });
  assert.equal(result.isError, undefined);
  const structured = result.structuredContent as { primary: string };
  assert.equal(structured.primary, "mist_id");
});

test("callTool id_generate mist_id includes a local warning", async () => {
  const result = await client.callTool({
    name: "id_generate",
    arguments: { algorithm: "mist_id", count: 2 },
  });
  assert.notEqual(result.isError, true);
  const structured = result.structuredContent as { ids: string[]; warning?: string };
  assert.equal(structured.ids.length, 2);
  assert.match(structured.warning ?? "", /shared increment/i);
});

test("callTool id_generate unknown slug is an error result", async () => {
  const result = await client.callTool({
    name: "id_generate",
    arguments: { algorithm: "not_a_real_slug" },
  });
  assert.equal(result.isError, true);
  const text = (result.content[0] as { type: string; text: string }).text;
  assert.match(text, /Unknown algorithm/);
});
