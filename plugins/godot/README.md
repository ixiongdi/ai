# godot

Godot 4 agent tooling. Skill plus one community MCP server.

| File | Contents |
| ---- | -------- |
| [plugin.json](plugin.json) | plugin manifest |
| [mcp.json](mcp.json) | starts `godot` via `npx -y gopeak` |
| [skills/godot/SKILL.md](skills/godot/SKILL.md) | setup gates, ports, tool discovery, working rules, fallbacks |

## Why this server

**Godot Foundation publishes no MCP server and no agent skills**, so anything
here is community work. This plugin wires up
[GoPeak](https://github.com/HaD0Yun/Gopeak-godot-mcp) (`gopeak`, MIT), chosen
over the rest of the field because it is:

- **pullable, not buildable** — `npx -y gopeak`, where its nearest rivals
  document `git clone && npm install && npm run build`;
- **maintained** — actively released, not a frozen 0.1.x package;
- **a superset** — it credits and extends `Coding-Solo/godot-mcp` and keeps
  legacy tool names working under a documented migration policy;
- **context-aware** — paginated `tools/list` plus a `compact` default profile
  that activates capability groups on demand;
- **honest** — capabilities needing extra Godot-side services are labelled
  setup-gated rather than silently failing.

Requirements: Godot 4.x, Node 18+. Set `GODOT_PATH` if Godot is not
auto-detected.

## Setup gates

Project control (launch editor, run/stop, read debug output) works out of the
box. Everything richer is gated:

| Capability | Needs |
| ---------- | ----- |
| Scene and resource editing | `godot_mcp_editor` plugin in the project |
| Runtime inspection, screenshots, input | runtime addon, port `7777` |
| GDScript diagnostics | Godot LSP on `6005` |
| Breakpoints, stack traces | Godot DAP on `6006` |

Ports: `6505` bridge + visualizer (loopback), `6005` LSP, `6006` DAP, `7777`
runtime socket.

## Fallback

Coding-Solo's original `@coding-solo/godot-mcp` needs nothing installed on the
Godot side and gets you run → read console → fix. Use it when you cannot install
into the project. Both configs are in the skill.
