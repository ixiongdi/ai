# id-generator MCP server

TypeScript stdio [MCP](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)
server implementing the **2026-07-28** spec via
[`@modelcontextprotocol/server`](https://ts.sdk.modelcontextprotocol.io/v2/) **v2**.

It exposes the three primitives a complete MCP server must provide:
**Tools** (model-controlled), **Resources** (application-controlled
context), and **Prompts** (user-selected workflows).

Catalog and generators are aligned with the language-agnostic
[`id-generator` skill](../../skills/id-generator/). Samples illustrate
format only — they are not a production cluster allocator.

This is not the Java module `id-generator-spring-ai-mcp-server`.

## Protocol risk (Cursor)

This server speaks **MCP 2026-07-28**. Cursor (and other hosts) that
still open the connection with a 2025-era `initialize` handshake may
fail to list tools until they support the new revision.

The TypeScript SDK’s `serveStdio` can still serve a **legacy** 2025
session from the same factory (`legacy: "serve"`, the default). If a
host cannot connect, verify with [MCP Inspector](#inspector) or another
2026-07-28 client before assuming the server is broken.

Claude Desktop / other hosts use the same stdio shape; they inherit the
same protocol-risk caveat.

## Install

Ship this server inside the **ixiongdi** [Agent Plugin](https://agent-plugins.org/).
User-level install: [code/README.md](../../README.md). That starts stdio via
`./scripts/run-id-generator-mcp.mjs` (builds `dist/` on first run) using
`${PLUGIN_ROOT}`. It does not write project `.cursor/mcp.json`.

ChatGPT's public plugin directory needs a hosted HTTPS MCP; this package
is local stdio (Codex / Cursor and other Agent Plugins hosts).

### For agent

```
Prefer Agent Plugin ixiongdi from https://github.com/ixiongdi/ai.git (do not clone into the user's project):
  Agent Plugins 1.0 hosts (Cursor, Codex, …): install the plugin; Cursor local: symlink code/ to ~/.cursor/plugins/local/ixiongdi
  Claude Code: skill/MCP fallback installer, do not /plugin install
MCP is stdio node ./scripts/run-id-generator-mcp.mjs (cwd ${PLUGIN_ROOT}). Node 20+ required. ChatGPT web cannot use local stdio MCP.
```

### For human

Plugin install: [code/README.md](../../README.md).
MCP-only symlink fallback:
`curl -fsSL https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.sh | bash -s -- --skip-skills`.

The plugin MCP entry looks like:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "id-generator": {
      "type": "stdio",
      "command": "node",
      "args": ["./scripts/run-id-generator-mcp.mjs"],
      "cwd": "${PLUGIN_ROOT}"
    }
  }
}
```

**Hosts that do not speak 2026-07-28 may not connect.** Dev without
build (tsx) is optional, from this package directory:

```json
{
  "mcpServers": {
    "id-generator": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"]
    }
  }
}
```


## Primitives

| Kind | Name | Role |
| ---- | ---- | ---- |
| Tool | `id_list_algorithms` | Paginated catalog with filters |
| Tool | `id_recommend` | Decision tree (entropy / uuid7 / mist / uuid8 + overrides) |
| Tool | `id_generate` | Local samples (Python skill set, including mist_id with a warning) |
| Tool | `id_explain` | Layout, when to use, limitations |
| Resource | `idgen://catalog` | All 39 algorithms as JSON |
| Resource | `idgen://decision-tree` | Official recommendation table (markdown) |
| Resource | `idgen://algorithms/{slug}` | One algorithm; `resources/list` enumerates sample-able slugs |
| Prompt | `choose-id` | Embeds the decision tree; instructs `id_recommend` |
| Prompt | `generate-samples` | Completable slug + count; instructs `id_generate` |

Shared-counter types `atomic_id`, `rid`, and `segment_chain_id` are
listed/explained but **not** generated locally. `mist_id` and `uuid_v8`
**are** sampled, with an explicit process-local warning.

Snowflake/sonyflake samples take an optional `worker` (default 0).
`uuid_v3` / `uuid_v5` require `name`.

## Requirements

Node.js 20+.

```bash
cd code/mcp/id-generator
npm install
npm test
npm run build
```

Tests drive a v2 `Client` in-process through `createMcpHandler` (no
socket), covering `listTools`, `listResources`, `getPrompt`, and
`callTool`.

## Inspector

Use a 2026-07-28-capable Inspector against the built stdio entry:

```bash
npm run build
npx @modelcontextprotocol/inspector node dist/index.js
```

Confirm tools, resources (`idgen://catalog`, `idgen://decision-tree`),
and prompts (`choose-id`, `generate-samples`).

## Skill

Agent instructions live in
[`code/skills/id-generator`](../../skills/id-generator/). Use this MCP
to print samples and attach catalog context; use the skill to change
application code. Do not clone a Java repo just to print a few IDs.

## License

MIT.
