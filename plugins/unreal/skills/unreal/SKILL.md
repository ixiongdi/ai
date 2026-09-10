---
name: unreal
description: >
  Unreal Engine 5 Editor automation for AI agents over Epic's official MCP
  server (the ModelContextProtocol plugin, named Unreal MCP in the Plugin
  Browser). Use when a task involves a .uproject, actors and levels,
  Blueprints, materials and material instances, Niagara, Sequencer, Control
  Rig, State Trees, Behaviour Trees, UMG, StaticMesh or SkeletalMesh assets,
  GAS, GameplayTags, Data Tables, automation tests, or authoring a new
  toolset. Recognise Unreal context from asset prefixes BP_ / WBP_ / M_ / MI_ /
  NS_ / CR_ / SK_ / SM_ / ABP_, UE C++ types and macros such as AActor and
  UPROPERTY, and the Content Browser / Outliner vocabulary. Skip for pure
  conceptual or documentation questions, and for Unity or Godot work.
---

# unreal

Unreal Engine 5.8 ships a first-party MCP server inside the Editor process. It
is **Experimental**: APIs and data formats change between releases, and Epic
says not to rely on it for production.

Two plugins matter, and they are not the same thing:

| Plugin | Role |
| ------ | ---- |
| **Unreal MCP** (`ModelContextProtocol` in `.uplugin`, C++, and console commands) | hosts the server and the transport |
| **AllToolsets** | supplies the actual toolsets. Without it the server exposes nothing |

The **Toolset Registry** plugin is a shared dependency and enables itself.

## Connecting

Enable **Unreal MCP** and **All Toolsets** in **Edit > Plugins**, restart when
asked, then start the server:

```
ModelContextProtocol.StartServer [port]
```

Auto-start is a per-developer preference, not a project default, so set it in
the per-user INI (`Config/DefaultEditorPerProjectUserSettings.ini`):

```ini
[/Script/ModelContextProtocolEngine.ModelContextProtocolSettings]
ServerUrlPath=/mcp
ServerPortNumber=8000
bAutoStartServer=True
bEnableToolSearch=True
```

Or do the same from **Edit > Editor Preferences > General > Model Context
Protocol**.

Each client wants its config in a different file and format. Let the plugin
write it, from the editor console:

```
ModelContextProtocol.GenerateClientConfig ClaudeCode
```

Supported names: `ClaudeCode`, `Cursor`, `VSCode`, `Gemini`, `Codex`, and `All`.
JSON configs merge with existing entries, so re-running is safe. The Codex TOML
config is write-once and refuses to overwrite. This plugin ships a static
`mcp.json` pointing at the default endpoint, so no generation step is needed
unless the port or URL path was changed.

Verify the endpoint is listening with `netstat -ano | grep 8000`, and check the
Output Log at editor startup: a failed bind (port in use, missing dependency)
surfaces there.

### Transport and endpoint

`http://127.0.0.1:8000/mcp`, Streamable HTTP with Server-Sent Events. **stdio and
WebSocket are not supported.** The `Accept` header must be
`application/json, text/event-stream`, and a response may be plain JSON or SSE —
parse `data:` lines when it is SSE. Handshake: `initialize`
(`protocolVersion` `2025-06-18`) → take `Mcp-Session-Id` from the response
headers → send it on every later request → `notifications/initialized`.

Loopback only, with origin validation and **no authentication layer**. Never
expose the port beyond the local machine.

## Tool discovery

Tool search is on by default, so `tools/list` returns three meta-tools instead
of hundreds of schemas:

- `list_toolsets` — toolset names and descriptions
- `describe_toolset` — the tools and schemas inside one toolset
- `call_tool` — dispatch a tool and get the result back on the same turn

```json
{
  "name": "call_tool",
  "arguments": {
    "toolset_name": "EditorToolset.EditorAppToolset",
    "tool_name": "CaptureViewport",
    "arguments": {}
  }
}
```

Common toolsets: `EditorToolset.EditorAppToolset` (camera, PIE, screenshots,
asset imaging), `EditorToolset.LogsToolset` (log reads), `AutomationTestToolset`
(test runs), plus `ToolsetRegistry.AgentSkillToolset` for engine skills.

Two things to respect when calling:

- **Never issue overlapping calls.** Invocations run serially on the game
  thread; concurrency produces confusing failures.
- **Read the schema before you trust a default.** Optional in the schema does
  not mean optional in the implementation.

## Gotchas worth knowing before you debug for an hour

- **`CaptureViewport` needs everything passed explicitly.** `captureTransform`
  and `annotations` are marked optional but the implementation rejects their
  absence (`input param "captureTransform" needs a default value`). To use the
  editor's current view, call `GetCameraTransform` first and pass the result
  straight back. All-zero annotations disable the grid and label overlays:

  ```json
  {
    "captureTransform": {"location": {"x":0,"y":0,"z":260000}, "rotation": {"pitch":-60,"yaw":0,"roll":0}, "scale": {"x":1,"y":1,"z":1}},
    "annotations": {"gridSpacing":0, "gridExtent":0, "gridHeight":0, "maxLabelDistance":0, "classFilter":{"refPath":""}, "maxLabels":0},
    "bShowUI": false
  }
  ```

- **Results are JSON strings inside text content.** A toolset return value needs
  a second parse before you can reach fields such as `returnValue.image.data`
  (a base64 PNG).
- **New tools need an editor restart.** Live Coding updates existing function
  bodies but does not propagate new `UFUNCTION` declarations. After authoring or
  hot-reloading, run `ModelContextProtocol.RefreshTools`; a connected client may
  still hold the old schema, so reconnect.

Console commands: `ModelContextProtocol.StartServer [port]`, `StopServer`,
`RefreshTools`, `GenerateClientConfig <Client|All>`. Raise verbosity with
`Log LogModelContextProtocol Verbose`.

For protocol-level debugging, point the official inspector at the endpoint over
Streamable HTTP: `npx @modelcontextprotocol/inspector`. It lists every
advertised tool with its declared schema and bypasses the agent's interpretation
of a request, which is the fastest way to tell a tool bug from a prompt bug.

## Epic's first-party skills

`EpicGames/unreal-engine-skills-for-claude-code-plugin` is published in
Anthropic's official marketplace. Its `unreal-mcp` skill carries the setup
reference, the toolset routing table, and the operation guide; it also installs
a `SessionStart` hook that tells the agent the repo is an Unreal project so UE
conventions win by default. It ships **no** static `.mcp.json` on purpose —
`GenerateClientConfig` is the source of truth for port and path.

```
/plugin install unreal-engine-skills-for-claude-code@claude-plugins-official
```

For teams, commit `"unreal-engine-skills-for-claude-code@claude-plugins-official": true`
under `enabledPlugins` in `.claude/settings.json`. The hook is a bash script, so
on Windows it needs Git Bash or WSL; without one the MCP tools still work and
only the context note is lost.

Epic also ships an **Editor Tools** plugin with the engine's own AI toolsets.
Enable it alongside Unreal MCP to give an agent both.

Useful community references, not official: `tc-imba/ue-official-mcp` publishes a
per-release snapshot of the live tool catalog with full input/output schemas
(handy because the plugin drifts between patch releases), and toolsets can be
extended in Python or C++ through the Toolset Registry.

## Security

Installing this gives an agent live, privileged access to the Editor.
`ProgrammaticToolset.execute_tool_script` runs arbitrary Python inside the
editor process with access to the project on disk and the asset database. Tools
mutate live `UObject` state and can move or delete VCS-tracked assets in a
single call. Save and commit before a long MCP session, and review the diff
before submitting. Do not run the client with permission prompts disabled while
this server is connected to anything you care about.

## Workflow compile notes (UE 5.8, hands-on)

- Include the matching header before other headers (IWYU).
- `StaticEnum<T>()` specialisations live in the type's `generated.h`; a missing
  include reports C2280. `EMaterialDomain` needs `#include "MaterialDomain.h"`.
- A delay-loaded DLL can only resolve **function** imports. Referencing an
  imported **data** symbol (for example `PCG::Private::UserParameterTagData`)
  is LNK1194; link normally instead (`bDelayLoad=false`).
- Where UBA hits file locks, add `-NoUba` to stabilise the build:
  `Build.bat <Target> Win64 Development -project=<uproject> -NoUba -WaitMutex`.
