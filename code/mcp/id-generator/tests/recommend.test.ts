import assert from "node:assert/strict";
import { test } from "node:test";
import { recommend } from "../src/recommend.js";

test("uncoordinated long -> entropy_id", () => {
  const rec = recommend({ coordination: "none", output: "long" });
  assert.equal(rec.primary.slug, "entropy_id");
});

test("uncoordinated string -> uuid_v7", () => {
  const rec = recommend({ coordination: "none", output: "string" });
  assert.equal(rec.primary.slug, "uuid_v7");
});

test("shared long -> mist_id", () => {
  const rec = recommend({ coordination: "shared", output: "long" });
  assert.equal(rec.primary.slug, "mist_id");
});

test("shared string -> uuid_v8", () => {
  const rec = recommend({ coordination: "shared", output: "string" });
  assert.equal(rec.primary.slug, "uuid_v8");
});

test("js_safe overrides", () => {
  const rec = recommend({ coordination: "none", output: "long", js_safe: true });
  assert.equal(rec.primary.slug, "js_safety_id");
});

test("url_safe -> nano_id", () => {
  const rec = recommend({ coordination: "none", output: "string", url_safe: true });
  assert.equal(rec.primary.slug, "nano_id");
});
