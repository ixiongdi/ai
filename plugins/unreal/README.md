# unreal

Unreal Engine 5.8 agent tooling. One MCP endpoint plus one skill.

| File | Contents |
| ---- | -------- |
| [plugin.json](plugin.json) | plugin manifest |
| [mcp.json](mcp.json) | `unreal-mcp` over Streamable HTTP at `http://127.0.0.1:8000/mcp` |
| [skills/unreal/SKILL.md](skills/unreal/SKILL.md) | plugin setup, tool-search meta-tools, `call_tool` format, gotchas, Epic's first-party skills |

Epic's server is embedded in the Editor; there is nothing to install from a
registry and nothing vendored here. The endpoint only exists while the Editor is
running with **Unreal MCP** and **All Toolsets** enabled.

Only HTTP and SSE are supported — no stdio, no WebSocket. Loopback only, no
authentication.

Epic's own Claude Code plugin lives at
`EpicGames/unreal-engine-skills-for-claude-code-plugin` and is installed from
Anthropic's official marketplace; its MCP config is generated in-editor by
`ModelContextProtocol.GenerateClientConfig`.
