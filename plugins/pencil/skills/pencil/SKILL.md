---
name: pencil
description: >
  pen.dev (the product formerly called Pencil) is an agent-driven design canvas
  whose .pen files live in the codebase; its MCP server registers under the name
  pencil. Use when a task involves .pen files, designing or editing screens,
  components, dashboards, landing pages, design systems, variables and theming,
  exporting designs to PNG/JPEG/WEBP/PDF/HTML, syncing design with code, or
  automating design work with the pen CLI. Covers the local MCP connection, the
  server-side skills, and the CLI. Not a general image-generation or
  UI-framework skill.
---

# pencil

pen.dev is a vector design canvas that lives inside the IDE and speaks MCP. The
unit of work is a **`.pen` file kept in the repository next to the code**, so
designs version, branch, and review with Git like any other file.

Two names, one product: the app and the CLI are **pen.dev** (formerly Pencil),
and the MCP server still registers as **`pencil`** — that is the string your
client will show in its server list. This plugin is named `pencil` to match.

Agents reach it two ways, and they are not interchangeable:

| Path | How |
| ---- | --- |
| Integrated agent | Connect a provider in **Settings → Agents** inside pen.dev |
| External MCP client | Connect over stdio to a running pen.dev desktop or IDE host |

This skill covers the second, plus the CLI for headless work.

## Connecting an external client

pen.dev **writes the client config itself**. Do not hand-author an MCP entry for
it.

1. Install the desktop app, or the VS Code / Cursor extension.
2. Open the `.pen` document the agent should work on. The connection is bound to
   an open document; there is nothing to talk to without one.
3. Open **Settings (⚙️) → MCP** and enable your client. Supported desktop
   integrations include Claude Code CLI, Codex CLI, Gemini CLI, Antigravity 2.0,
   OpenCode CLI, Kiro CLI, and Claude Desktop. ChatGPT desktop and the Codex IDE
   extension share the Codex CLI entry.
4. Start or reload the client, then confirm **`pencil`** appears in its MCP
   server list. The server name is `pencil`, not `pen`.

Why not ship a static config: the entry points at an MCP server binary bundled
inside the installed app or extension — a path that changes with every release —
and passes a per-session WebSocket port. A hardcoded entry goes stale on the next
update and conflicts with what pen.dev writes. If a connection keeps failing,
re-enable the client from that settings panel rather than editing JSON.

Troubleshooting order: pen.dev running → a `.pen` document open → the entry
launches over stdio → client reloaded after any config change.

## Tools

The public server registers a deliberately small set:

| Tool | Notes |
| ---- | ----- |
| `read_skill` | Loads instructions: `.pen` schema, `execute`, common workflows |
| `get_style` | Lists or loads a visual style |
| `get_app_state` | Document metadata, structure, selection context |
| `execute` | The workhorse: read, modify, render, export |
| `browser` | Only when the server targets the desktop app |
| `spawn_agents` | Only when the server was started with `-enable_spawn_agents` |

Check the live tool list rather than trusting a list: `browser` and
`spawn_agents` are conditional on how the server was launched.

Older Pencil-era skills circulating online still use names like `batch_design`,
`batch_get`, `get_editor_state`, and `get_variables`. Those have been
consolidated — an operation within them is now an operation within `execute`,
and whole-document state comes from `get_app_state`. Do not route through the
old names.

## Skills live server-side

pen.dev's own skills are not `SKILL.md` files to install; they are read over MCP
at the moment they are needed:

```
read_skill()                              # what is available
read_skill({ path: "pen-schema.md" })     # the .pen schema
read_skill({ path: "execute.md" })        # the execute operation format
get_style()                               # available visual styles
```

Call `read_skill()` before writing `execute` operations, and again whenever an
operation is rejected. The schema is authoritative and cheaper than a retry
loop. `get_style` is the counterpart for visual direction: load a style so
new work matches what is already on the canvas instead of inventing a palette.

## Working rules

**Read before writing.** `get_app_state` establishes what document is open and
what is selected. `execute` reads nodes and computed bounds, so an inspection
pass is cheap — use it to learn the existing structure and variables before
proposing changes.

**Work in operations, not pixels.** `execute` covers insert, copy, update,
replace, move, and delete as operations, plus variable and theme reads and
writes, image generation, screenshots, and export. Prefer describing the
structure you want over emitting raw coordinates.

**Verify visually.** Screenshots and previews are taken through `execute`
(`TakeScreenshot`, `Export`). A design change that was never looked at is not
finished, and visual bugs — clipped content, collapsed layout, overlapping
elements — do not show up in the operation result.

**Do not hand-edit the JSON.** `.pen` files are JSON-based, readable, and
Git-friendly, but pen.dev's own guidance is to modify them through pen.dev, the
CLI, or the MCP tools rather than by editing the file. Direct edits bypass the
editor's validation and are the fastest way to produce a file the canvas will
not open.

**Keep the canvas out of the main context.** MCP design output is large, and
design work is iterative. Delegating a design task to a subagent and taking back
a short summary keeps the main conversation usable for several rounds instead of
one.

**Commit before long sessions.** Design files are code here. Save and commit so a
bad batch of operations is a revert rather than a rebuild.

## CLI

The CLI runs the same editor engine headless, with no GUI. It needs Node.js
22.19 or later:

```bash
npm install -g @pen.dev/cli
pen login                     # session stored in ~/.pencil/session-cli.json
pen version
```

Agent mode — one prompt, one output file:

```bash
pen --out login.pen --prompt "Create a login page with email and password fields"
pen --in dashboard.pen --out dashboard-v2.pen --prompt "Add a sidebar navigation"
pen --in design.pen --export hero.png --export-scale 2
```

Useful flags: `--agent claude|codex|gemini` (or let `--model` imply it),
`--effort`, `--tasks batch.json` for sequential batch runs, `--repo` to set the
agent's working directory, `--enable-preview` to snapshot after each change,
`--usage` for token and cost reporting, `--verbose-mcp` to surface full tool
errors.

Interactive mode calls the MCP tools directly, which is how you script or debug
a specific sequence:

```bash
pen interactive -a desktop -i my-design.pen      # attach to the running app, live edits
pen interactive -i input.pen -o output.pen       # headless; save() writes the file
```

Inside the shell: `tool_name({ key: value })`, `save()`, `exit()`.

For CI/CD set `PEN_CLI_KEY` (from the org's Developer Keys) and the provider key,
for example `ANTHROPIC_API_KEY`; `PEN_CLI_KEY` takes precedence over the stored
session. `pen codex-login` signs in a ChatGPT Plus/Pro account for `--agent codex`.

## Design and code

The point of the format is that both live in one repo:

- **Design → code:** generate React/HTML/CSS from a component or a full screen,
  or derive design tokens from the `.pen` variables.
- **Code → design:** recreate an existing component on the canvas when the `.pen`
  file and the source sit in the same workspace.
- **Figma:** copy and paste designs in; vectors, text, and styles come across.

Generated code still needs the usual review — responsiveness, accessibility, and
behaviour are not settled by the fact that the layout matched.
