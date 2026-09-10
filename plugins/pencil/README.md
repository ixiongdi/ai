# pencil

pen.dev agent tooling. **Skills only — no MCP server entry.**

| File | Contents |
| ---- | -------- |
| [plugin.json](plugin.json) | plugin manifest |
| [skills/pencil/SKILL.md](skills/pencil/SKILL.md) | the MCP connection, the server-side skills, the `.pen` workflow, and the CLI |

## The name

The product is **pen.dev**, renamed from **Pencil**. The MCP server kept the old
name and registers as **`pencil`** — that is the string your client shows in its
server list. This plugin is named `pencil` to match what you actually see in the
client, rather than the marketing name.

## Why no `mcp.json`

pen.dev runs a **local MCP server over stdio**, but it writes the client config
itself. You open **Settings → MCP** in the desktop app or IDE extension, enable
the client (Claude Code CLI, Codex CLI, Gemini CLI, Antigravity, OpenCode CLI,
Kiro CLI, Claude Desktop), and pen.dev installs the entry.

There is no stable config to ship here. The entry points at an MCP server binary
bundled with the installed app or extension — a path that changes on every
pen.dev update — and passes a WebSocket port assigned per session. A hardcoded
entry would be wrong on the next update and would fight the config pen.dev just
wrote.

The skill covers what to do instead.

## Skills

pen.dev's skills live **server-side** and are read through MCP: `read_skill`
loads the `.pen` schema, the `execute` format, and common workflows; `get_style`
lists or loads a visual style. Nothing to vendor.
