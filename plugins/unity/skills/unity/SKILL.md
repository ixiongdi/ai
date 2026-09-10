---
name: unity
description: >
  Unity Editor automation for AI agents, CLI-first. Use when a task involves a
  Unity project: scenes, GameObjects, prefabs, C# scripts, URP and Shader Graph,
  UI Toolkit or uGUI, TextMeshPro, 2D and tilemaps, sprite atlases, builds and
  tests, localization, multiplayer, Unity Gaming Services, IAP, LevelPlay, UPM
  packages, or the Unity CLI. Covers the Unity CLI, its MCP server, the Pipeline
  package that connects the CLI to the Editor, and Unity's first-party skills.
  The older in-Editor MCP relay is documented as a deprecated fallback.
  Not for Unreal Engine, not for Godot.
---

# unity

Unity's supported agent path is the **Unity CLI**, not the in-Editor MCP bridge.
The CLI is the same surface Unity's own Hub is built on, it drives the Editor
through a package, and it carries both an MCP server and a skill installer.

Two paths exist. This plugin defaults to the first:

| Path | Status | Entry point |
| ---- | ------ | ----------- |
| Unity CLI | **current** | `unity mcp` (stdio MCP server) |
| In-Editor relay | deprecated | `~/.unity/relay/relay_win.exe --mcp` |

The relay is still documented at the end because it works and people have it
installed. Do not reach for it first.

## Install the CLI

The CLI is **experimental**. It ships with the Unity Hub, and also installs
standalone:

```bash
# macOS / Linux
curl -fsSL https://public-cdn.cloud.unity3d.com/hub/prod/cli/install.sh | UNITY_CLI_CHANNEL=beta bash

# macOS / Linux via Homebrew
brew install --cask unity-cli

# Windows
winget install Unity.CLI
```

Linux lands at `~/.local/bin/unity` (on `PATH` by default on most
distributions; the oldest installs under `~/.unity` get migrated). Windows also
gets a copy at `%LOCALAPPDATA%\Unity\bin\unity.exe` — and the Hub does **not**
add that directory to `PATH`. A bare `unity` therefore often fails to spawn on
Windows, which is why this plugin launches through a script that resolves the
binary instead.

Update with `unity upgrade`. Platform floor: Windows 10 21H1+, macOS 14+, Linux
RHEL 9 / Ubuntu 22.04+ with glibc 2.34+.

## The CLI has two halves, and they fail separately

This is the distinction that costs the most time:

1. **The CLI as a tool** — install Editors, open projects, build, test. Works
   with no Editor running.
2. **The CLI driving a running Editor** — needs the **Unity Pipeline package**
   installed into the project. Without it, `unity command`, `unity list`, and
   `unity status` have nothing to talk to.

```bash
unity auth login          # browser sign-in, session is cached
unity pipeline install    # adds the Unity Pipeline package to the project
unity pipeline list       # expect "Pipeline: Installed"
```

`unity pipeline install` targets the current directory or the running Editor.
After it runs, reopen the project in the Editor and let it recompile.

## MCP

```bash
unity mcp                                  # MCP stdio server, waits for a client
unity mcp --project-path /path/to/MyProject
unity mcp configure --list                 # supported clients and where they write
unity mcp configure cursor                 # write the entry into that client's config
```

Verified behaviour: `unity mcp` prints *"MCP server started (stdio). Waiting for
a client connection."* and then waits — it does not require an Editor to be up
front, but every Editor-facing tool call does.

**Let the CLI write the config when it can.** `unity mcp configure <client>`
knows 17 clients and their real config paths: `claude`, `claude-code`, `cursor`,
`vscode`, `vscode-insiders`, `copilot-cli`, `windsurf`, `cline`, `codex`, `kiro`,
`kimi`, `trae`, `openclaw`, `antigravity`, `zed`, `continue`, `inspect`. Where it
cannot write the file directly it prints the command to run — for Claude Code it
delegates to `claude mcp add --scope user --transport stdio unity-editor-mcp unity mcp`.

**The server name is not constant.** A VS Code-style entry is written as
`"unity"`. The Claude Code delegation registers it as `unity-editor-mcp`. Both
are correct; they come from different code paths. Tool namespacing follows
whichever name the client ended up with, so check the client's server list
before writing `mcp__unity__*` into a prompt.

This plugin's `mcp.json` registers `unity`, launching `unity mcp` through
`scripts/unity-cli-mcp.mjs`, which finds the binary via `UNITY_CLI_PATH`, then
`PATH`, then the known install locations. Set `UNITY_CLI_PATH` if your install is
somewhere unusual.

## Driving the Editor

```bash
unity status                     # every connected Editor: port, project, version, PID, state
unity list                       # tools the connected Editor exposes
unity command                    # list them (same idea, different view)
unity command <name> [args...]   # run one on the connected Editor
unity job                        # manage detached Editor command jobs
unity run --command <name>       # run a registered command headless, no Editor UI
unity build                      # batch-mode build
unity test                       # run Editor tests
unity doctor                     # diagnostic snapshot
unity logs                       # read or tail logs
```

Useful options:

- `--project-path <path>` on `status`, `command`, and `list` when several
  projects are open. Also read from `UNITY_PROJECT_PATH`.
- `--runtime <player exec name>` / `--runtime-path <path>` connect to a **built
  player** rather than the Editor, which is how you drive a running game.
- Global output control on every command: `--json`, `--format json|tsv|ndjson`,
  `--non-interactive`, `--quiet`, `--verbose`.

**Start with `unity status`.** It answers "is anything actually connected", which
is the precondition for every other command and the question that otherwise gets
misdiagnosed as a broken tool.

**Discover before calling.** `unity list` reports what the connected Editor
actually exposes; the available command set depends on the Pipeline package
version and the project. Do not assume a command exists — this surface is
experimental and moves.

## Skills

Unity ships agent skills through three doors. Prefer the first, because it
matches the installed CLI version:

```bash
unity skill install --list            # clients, paths, install status
unity skill install claude-code
unity skill install cursor --local    # project-local instead of user-global
```

Supported clients: `claude-code`, `claude-desktop`, `grok`, `cursor`,
`windsurf`, `vscode`, `cline`, `codex`.

The two upstream repositories, for reference — do not copy them into a project:

- **`Unity-Technologies/unity-agent-plugin`** — the official plugin, skills only
  (no hooks, no MCP servers), Unity 6.0+, for Claude Code / Codex / Grok.
  Roughly 29 skills across project setup, the CLI, UPM packages, UI and text, 2D
  and sprites, graphics and rendering, audio, scene and gameplay, monetization
  and live ops, multiplayer, and platform/localization.
  `/plugin marketplace add Unity-Technologies/unity-agent-plugin` then
  `/plugin install unity@unity-agent-plugin`.
- **`Unity-Technologies/skills`** — standalone reusable skills for agents that
  do not have a plugin system: `npx skills add Unity-Technologies/skills`.
  Includes `new-unity-project`, `unity-cli`, `unity-package-management`,
  `build-live-game`, `implement-in-app-purchases`, `levelplay-unity-integration`,
  `ui` (a router that detects the project's UI system and dispatches to
  `ui-uitk` / `ui-ugui` / `ui-imgui`),
  `validate-urp-render-graph-renderer-feature`,
  `shader-graph-create-custom-node`, `setup-multiplayer-services`.

Working notes:

- Read a skill's `references/` folder when a result looks wrong. The front
  matter is a trigger, not the payload; skipping the references is the usual
  cause of a plausible but incorrect answer.
- Name the UI framework in UI requests. Unity has three UI systems and
  recommends UI Toolkit for new projects — say which one rather than letting the
  agent guess.
- Expect clarifying questions before edits. Good interactively, harmful in
  pipelines; in automation, write prompts detailed enough that no follow-up is
  needed.
- These skills carry Unity's Companion License. The plugin is not an Asset Store
  package and never appears in the Package Manager.

## Fallback: the in-Editor MCP relay (deprecated)

Unity's Assistant 2.18 docs state:

> Unity MCP server is deprecated. Use the Unity command-line interface (CLI)
> instead. Unity CLI provides faster iteration times, improved stability, and
> the ability to target runtime and the Editor.

The relay still works and requires a different setup, so it is worth recognising:
the project needs the `com.unity.ai.assistant` package, the MCP bridge must show
**Running** in **Edit > Project Settings > AI > Unity MCP Server**, and the
Editor installs a relay binary into `~/.unity/relay/`.

| Platform | Relay path |
| -------- | ---------- |
| Windows | `%USERPROFILE%\.unity\relay\relay_win.exe` |
| Linux | `~/.unity/relay/relay_linux` |
| macOS (Apple Silicon) | `~/.unity/relay/relay_mac_arm64.app/Contents/MacOS/relay_mac_arm64` |
| macOS (Intel) | `~/.unity/relay/relay_mac_x64.app/Contents/MacOS/relay_mac_x64` |

Run it with `--mcp`, which is what puts it in MCP-server mode. It also accepts
`--name`, `--project-path`, `--instance-id <pid>`, `--debug`, `--log`, and
`--log-dir`. `scripts/unity-relay.mjs` in this plugin resolves the path per
platform; override with `UNITY_RELAY_PATH`.

Relay-specific behaviour that does not apply to the CLI path:

- **First connection needs approval.** A direct external client appears as a
  **Pending Connection** in the MCP server settings page and cannot call tools
  until someone presses **Allow**. Gateway connections from the in-editor
  Assistant are auto-approved.
- **Tool names are PascalCase with a `Unity_` prefix** — `Unity_ManageScene`,
  `Unity_ManageGameObject`, `Unity_ReadConsole`.
- Targeting is `--project-path` / `UNITY_PROJECT_PATH` or
  `--instance-id` / `UNITY_INSTANCE_ID`, and a command-line argument beats the
  variable.
- A startup banner on stderr names the PID, project path, and instance ID.
  `Named pipe connection error: ENOENT` there means the client started fine and
  no Editor is listening.

## Notes that save time

- The Unity MCP Server settings page configures the server Unity *exposes*. The
  Assistant MCP Extensions page configures servers the in-editor assistant
  *connects to*. Do not confuse the directions, and note that both belong to the
  deprecated path.
- Unity's own `SKILL.md` files are read only by the in-editor Assistant. External
  agents run in their own harnesses and read `CLAUDE.md`, `AGENTS.md`, or their
  own skills directory.
- An agent saying it made a change is not evidence of a change. Check the diff,
  then open the project and read the console. Both paths write real project
  state, so branch and commit before a long automated session.
- The CLI is localized. If output looks unfamiliar, `unity language` changes the
  display language; `--format json` sidesteps parsing prose entirely.
