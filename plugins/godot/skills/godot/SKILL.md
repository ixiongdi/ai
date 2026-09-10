---
name: godot
description: >
  Godot 4 agent tooling. Use when a task involves a Godot project: .tscn and
  .tres files, GDScript or C#, nodes and scene trees, signals, autoloads,
  TileMapLayer, CharacterBody2D/3D, resources, physics, animation trees, UI,
  export presets, or the run / read console / fix loop. Covers the community MCP
  server this plugin wires up (GoPeak), its setup gates and ports, and the
  fallbacks. Not for Unity, not for Unreal Engine, not for Blender.
---

# godot

**Godot Foundation ships no official MCP server and no official agent skills.**
Neither `godotengine/*` nor the official docs publish either one. Projects
advertised as "Godot's official MCP" are community work that happens to be
listed in Godot's own Asset Library or Asset Store — the listing is official,
the code is not.

So this plugin picks a community server and wires it up.

Godot is unusually well suited to agent work, and the reason is structural:
scenes are text (`.tscn`), scripts are text, the engine runs headless, and the
editor ships a Language Server (`tcp://127.0.0.1:6005`) and Debug Adapter
(`6006`). Nothing stands between an agent and a diffable project.

## The server this plugin uses

[GoPeak](https://github.com/HaD0Yun/Gopeak-godot-mcp) — `gopeak` on npm, MIT.

```json
{
  "mcpServers": {
    "godot": { "command": "npx", "args": ["-y", "gopeak"] }
  }
}
```

Why this one over the rest of the field:

- **Pullable, not buildable.** `npx -y gopeak` runs the published package. Its
  two nearest rivals both document `git clone && npm install && npm run build`
  instead, which puts a build step and a pinned working copy into every setup.
- **Maintained.** Actively released, unlike the 0.1.x packages that sit frozen
  while their repositories move on.
- **A superset, not a fork.** It credits and extends
  [Coding-Solo/godot-mcp](https://github.com/Coding-Solo/godot-mcp) (the
  best-known Godot MCP) and keeps legacy tool names working under a documented
  migration policy, so advice written against the original still applies.
- **Built for the context limit.** `tools/list` is paginated and the default
  `compact` profile exposes a small core surface, activating capability groups
  on demand. The alternative — 149 tools advertised eagerly — spends a large
  slice of the window before any work happens.
- **Honest about what is not ready.** Capabilities that need extra Godot-side
  services are labelled as setup-gated rather than silently failing.

Requirements: **Godot 4.x** and **Node 18+**. Godot is auto-detected; set
`GODOT_PATH` when it is not.

## Setup gates

GoPeak's capabilities are laddered, and knowing which rung you are on explains
most failures:

| Capability | Needs |
| ---------- | ----- |
| Project control: find projects, launch editor, run/stop, collect debug output | nothing beyond Godot + Node |
| Scene and resource editing, live bridge edits | `godot_mcp_editor` plugin enabled in the project |
| Runtime inspection, screenshots, input injection | runtime addon, socket on port `7777` |
| GDScript diagnostics | Godot LSP on `6005` |
| Breakpoints, stepping, stack traces | Godot DAP on `6006` |
| Asset search and download | network, provider availability |

The addons install from the project folder and are then enabled in **Project
Settings → Plugins**:

```bash
# macOS / Linux
curl -sL https://raw.githubusercontent.com/HaD0Yun/Gopeak-godot-mcp/main/install-addon.sh | bash
```

```powershell
# Windows
iwr https://raw.githubusercontent.com/HaD0Yun/Gopeak-godot-mcp/main/install-addon.ps1 -UseBasicParsing | iex
```

`godot_mcp_editor` backs the editor bridge. `godot_mcp_runtime` backs runtime
inspection, screenshots, and input.

## Finding tools

`compact` is the default profile and does not advertise everything. Discover
rather than guess:

- `tool.catalog` — search; matching groups auto-activate
- `tool.groups` — manage groups directly

Groups: `runtime`, `testing`, `lsp`, `dap`, `asset_store`, `class_advanced`,
`tilemap`, plus mutation groups (scene, resource, script, settings, signal,
autoload, import, audio, navigation, theme, animation) and the opt-in
`intent_tracking` workflow layer.

If the client does not refresh after activation, reconnect it, or call one of the
newly activated tools to force a fresh `tools/list` round trip. Pagination is
tunable with `GOPEAK_TOOLS_PAGE_SIZE` (default 33).

`class_advanced` is worth knowing about: it answers "does this class, property,
or method exist in *my* Godot version" from static engine metadata, which is the
cheapest way to avoid writing code against an API the user's build does not have.

## Settings

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `GODOT_PATH` | auto-detect | Godot executable |
| `GOPEAK_TOOL_PROFILE` | `compact` | `compact`, `full`, `legacy` (`MCP_TOOL_PROFILE` is an alias) |
| `GODOT_BRIDGE_PORT` | `6505` | bridge + visualizer, loopback |
| `GOPEAK_BRIDGE_HOST` | `127.0.0.1` | bridge bind host |
| `GOPEAK_TOOLS_PAGE_SIZE` | `33` | tools per `tools/list` page |
| `GOPEAK_RUNTIME_TIMEOUT_MS` | `10000` | runtime command timeout |
| `DEBUG` / `LOG_MODE` | `false` / `lite` | server logging |

Typed Godot values are explicit when it matters — `add_node` and
`set_node_properties` accept:

```json
{ "position": { "type": "Vector2", "x": 100, "y": 200 } }
```

Plain `{ "x": 100, "y": 200 }` and `[100, 200]` are coerced for common
`Vector2` fields, but the tagged form is safest.

## Working rules

**Use the live editor when the developer is looking at something.** Driving a
running editor is not the same as `godot --headless`: a fresh headless process
has no open scene, no selection, and no undo history, so it cannot act on what
is on screen and `Ctrl+Z` will not reverse its edits. GoPeak's editor bridge
routes writes through `UndoRedo`; the headless path does not.

**Read the text files directly.** `.tscn`, `.tres`, `project.godot`, and
`export_presets.cfg` are plain text and diff cleanly. When the task is to
*understand* a scene, reading the file beats asking a server to describe it.

**Close the loop.** The value of this setup is `run project → read debug output →
fix`. Do not report a change as working without running it; a Godot script error
is a runtime event, and nothing in a successful file write tells you it compiles.

**Respect the gate you are actually on.** If a scene edit fails and the editor
plugin was never enabled, that is the answer — not a tool bug. Check the ladder
above before debugging the server.

**Version-aware advice.** Jolt became the default physics engine in 4.6 and
Direct3D 12 became the Windows default renderer around the same release. Confirm
the project's version before recommending physics or rendering settings.

**UIDs are load-bearing.** Godot 4.4+ introduced resource UIDs (`.uid` files,
`uid://` references). Moving or regenerating resources by hand breaks them;
prefer APIs that resave resources and update references.

## Fallbacks

**Zero setup on the Godot side.** Coding-Solo's original needs no addon at all —
it launches the editor, runs the project, and captures debug output, which is a
complete feedback loop and nothing more:

```json
{
  "mcpServers": {
    "godot": { "command": "npx", "args": ["-y", "@coding-solo/godot-mcp"] }
  }
}
```

Reach for it when you cannot install anything into the project, or when the task
is purely "run this and tell me what broke".

**Truly live editing with no extra process.** If the workflow must act on the
scene the developer has open, look at the addon-hosted servers listed in Godot's
own channels — `regiellis/godot-mcp-go` hosts a Streamable HTTP endpoint inside
the running editor at `127.0.0.1:9100/mcp` and exposes `ClassDB` from the running
build. Heavier to install, closer to the editor.

## Trust

None of this is audited here. These servers run with write access to the project
and execute engine code on request — treat one as you would running arbitrary
code, and keep a branch or backup before a long session.
