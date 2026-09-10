---
name: unity
description: >
  Unity Editor automation for AI agents. Use when a task involves a Unity 6+
  project: scenes, GameObjects, prefabs, C# scripts, URP and Shader Graph,
  UI Toolkit or uGUI, TextMeshPro, 2D and tilemaps, sprite atlases,
  localization, multiplayer, Unity Gaming Services, IAP, LevelPlay, UPM
  packages, or the Unity CLI. Covers the MCP server bridge and this plugin's
  relay launcher, and routes deeper work to Unity's first-party skills.
  Not for Unreal Engine, not for Godot.
---

# unity

Unity ships two official agent surfaces and this plugin wires both:

| Surface | What it is | Where it lives |
| ------- | ---------- | -------------- |
| MCP server | the Unity Editor exposes its own tools to an external agent over stdio | this plugin's `mcp.json` starts the relay |
| Skills | Unity's first-party task guides for coding agents | upstream repos, not vendored here |

Never copy `Unity-Technologies/unity-agent-plugin` or `Unity-Technologies/skills`
into the user's project. Reference them.

## MCP: connecting to a running Editor

### Prerequisites

- Unity 6 (6000.0) or later.
- The `com.unity.ai.assistant` package installed in the project.
- The Editor **open** with that project loaded. Close Unity and every tool call
  fails; there is no hosted Unity MCP endpoint to fall back on.

The MCP bridge starts automatically with the Editor. Verify it in
**Edit > Project Settings > AI > Unity MCP Server** and check that **Unity
Bridge** shows **Running**. If it shows **Stopped**, press **Start**.

The Editor also installs the relay binary into `~/.unity/relay/`. External MCP
clients launch that binary; it is the process that speaks MCP over stdio and
forwards calls to the bridge over a named pipe (Windows) or Unix socket.

### How this plugin starts it

`mcp.json` runs `scripts/unity-relay.mjs`, which locates the relay for the
current platform and execs it with `--mcp`:

| Platform | Relay path |
| -------- | ---------- |
| Windows | `%USERPROFILE%\.unity\relay\relay_win.exe` |
| Linux | `~/.unity/relay/relay_linux` |
| macOS (Apple Silicon) | `~/.unity/relay/relay_mac_arm64.app/Contents/MacOS/relay_mac_arm64` |
| macOS (Intel) | `~/.unity/relay/relay_mac_x64.app/Contents/MacOS/relay_mac_x64` |

`--mcp` is required: it is what puts the relay in MCP-server mode instead of its
other modes. Set `UNITY_RELAY_PATH` to override the lookup if the relay lives
somewhere else.

The relay also accepts, in MCP mode: `--name <string>` (custom server name),
`--project-path <path>`, `--instance-id <pid>`, `--debug`, `--log <level>`, and
`--log-dir <path>`. Add them to `args` in the client config. Its startup banner
goes to stderr and names the PID, the resolved project path, and the instance
ID, which makes it the first thing to read when a connection is refused —
`Named pipe connection error: ENOENT` there means the client started fine but no
Editor is listening.

### Targeting one Editor instance

With several Unity instances open, the relay connects to the first one it
discovers. Pin it explicitly through `args` in the client config, or through the
environment (a command-line argument wins over the variable):

| Target | Argument | Environment variable |
| ------ | -------- | -------------------- |
| Project | `--project-path <path>` | `UNITY_PROJECT_PATH` |
| Editor process | `--instance-id <pid>` | `UNITY_INSTANCE_ID` |

### First connection needs approval

A direct external client shows up as a **Pending Connection** in the MCP server
settings page and cannot call tools until someone approves it there
(**Allow**). Approved clients reconnect silently afterwards. Connections from
the in-editor Assistant over the AI gateway are auto-approved and skip this.

### Tool surface

Tool names are PascalCase with a `Unity_` prefix, for example `Unity_ManageScene`,
`Unity_ManageGameObject`, and `Unity_ReadConsole`. Tools register dynamically on
Editor startup, and projects can register custom ones. Multi-client is
supported: several agents can share one Editor.

A cheap connectivity check is asking the agent to read the Unity console and
summarize warnings and errors.

### Deprecation, read before promising anything

Unity's Assistant 2.18 docs mark the MCP server **deprecated** and point to the
Unity command-line interface instead:

> Unity MCP server is deprecated. Use the Unity command-line interface (CLI)
> instead. Unity CLI provides faster iteration times, improved stability, and
> the ability to target runtime and the Editor.

The forward path is Unity CLI plus the Unity Pipeline package
(`unity auth login`, then `unity pipeline install`, then `unity command` to
list what the connected Editor exposes). The CLI also installs Editors and
modules, which is a separate capability from driving the Editor. Treat the MCP
bridge as the working option today and the CLI as where Unity is heading; check
`unity command` / `unity mcp --help` on the user's machine before quoting a
subcommand, because this surface is moving.

## Skills: Unity's first-party skill sets

Two upstream repositories, different jobs. Install or clone them rather than
copying files into the project.

### `Unity-Technologies/unity-agent-plugin` — the official agent plugin

Skills only. No hooks, no MCP servers. Works with Unity 6.0+, for Claude Code,
Codex, and Grok. Covers roughly 29 skills across project setup, the Unity CLI,
UPM packages, UI and text, 2D and sprites, graphics and rendering, audio, scene
and gameplay, monetization and live ops, multiplayer, and platform/localization.

```bash
# Claude Code
/plugin marketplace add Unity-Technologies/unity-agent-plugin
/plugin install unity@unity-agent-plugin

# Codex
codex plugin marketplace add Unity-Technologies/unity-agent-plugin
codex plugin add unity@unity-agent-plugin
```

### `Unity-Technologies/skills` — reusable standalone skills

Installs into any agent that understands the Agent Skills layout, no plugin
system required. Useful when the agent is neither Claude Code nor Codex.

```bash
npx skills add Unity-Technologies/skills
```

Includes `new-unity-project`, `unity-cli`, `unity-package-management`,
`build-live-game`, `implement-in-app-purchases`, `levelplay-unity-integration`,
`ui` (a router that detects the project's UI system and dispatches to
`ui-uitk` / `ui-ugui` / `ui-imgui`), `validate-urp-render-graph-renderer-feature`,
`shader-graph-create-custom-node`, and `setup-multiplayer-services`.

### Using them well

- Read a skill's `references/` folder when a result looks wrong. The front
  matter is a trigger, not the payload; skipping the references is the usual
  cause of a plausible but incorrect answer.
- Name the UI framework in UI requests. Unity has three UI systems and Unity
  recommends UI Toolkit for new projects, so say "UI Toolkit" or "uGUI"
  explicitly instead of letting the agent guess.
- Name the skill explicitly when it does not auto-trigger.
- Expect clarifying questions before edits. That is good interactively and
  harmful in pipelines; in automation, write prompts with enough detail that no
  follow-up is needed.
- These skills carry Unity's Companion License, and the plugin is not an Asset
  Store package, so it never appears in the Package Manager.

## Notes that save time

- The Unity MCP Server page configures the server Unity *exposes*. The
  Assistant MCP Extensions page configures the servers the in-editor assistant
  *connects to*. Do not confuse the two directions.
- Unity's own SKILL.md files are only read by the in-editor Assistant. External
  agents such as Claude Code and Codex run in their own harnesses and read
  `CLAUDE.md`, `AGENTS.md`, or their own skills instead.
- An agent saying it made a change is not evidence of a change. Check the diff,
  then open the project and look at the console. This MCP surface writes real
  project state, so branch and commit before a long automated session.
