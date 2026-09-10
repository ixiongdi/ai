# unity

Unity Editor agent tooling, **CLI-first**. One MCP server plus one skill.

| File | Contents |
| ---- | -------- |
| [plugin.json](plugin.json) | plugin manifest |
| [mcp.json](mcp.json) | starts `unity` via `unity mcp` through the CLI launcher |
| [scripts/unity-cli-mcp.mjs](scripts/unity-cli-mcp.mjs) | resolves the `unity` binary, then execs `unity mcp` |
| [scripts/unity-relay.mjs](scripts/unity-relay.mjs) | deprecated fallback: the in-Editor relay binary |
| [skills/unity/SKILL.md](skills/unity/SKILL.md) | the CLI, its two halves, the MCP entries, the skills, and the relay fallback |

Nothing from Unity is vendored.

## Which path

| Path | Status | How |
| --- | --- | --- |
| Unity CLI | **current** | `unity mcp` (stdio MCP server) |
| In-Editor relay | deprecated | `~/.unity/relay/relay_*.exe --mcp` |

Unity's Assistant 2.18 docs mark the in-Editor MCP server deprecated and point at
the CLI. The CLI is where the surface is going, so `mcp.json` uses it. The relay
launcher stays in the plugin because it still works and people have it
installed — but it is no longer the default, and the skill says so plainly.

## The split that matters

The CLI has two halves and they fail independently:

- **The CLI as a tool** — install Editors, open projects, build, test. No Editor
  required.
- **The CLI driving a running Editor** — needs the **Unity Pipeline package**
  (`unity auth login`, `unity pipeline install`). Without it, `unity command`,
  `unity list`, and `unity status` have nothing to talk to.

`unity mcp` starts and waits for a client either way; it is the Editor-facing
tool calls that need the Editor.

## Why a launcher for a one-word command

`unity mcp configure vscode` writes an entry like this, and its own output warns
about the same problem:

```json
{ "servers": { "unity": { "type": "stdio", "command": "<abs path to unity>", "args": ["mcp"] } } }
```

The CLI is not reliably on `PATH`. On Windows the Hub puts it at
`%LOCALAPPDATA%\Unity\bin\unity.exe` and does not add that directory, so a bare
`command: "unity"` fails to spawn. The launcher resolves the binary from
`UNITY_CLI_PATH`, then `PATH`, then the known install locations.

Prefer `unity mcp configure <client>` when it supports the client — it knows 17
of them and their real config paths. Note the server name differs by code path:
`unity` for a VS Code-style entry, `unity-editor-mcp` when it delegates to
`claude mcp add`.

## Skills

`unity skill install <client>` installs the Unity CLI's own agent skill, matched
to the installed CLI version (`claude-code`, `claude-desktop`, `grok`, `cursor`,
`windsurf`, `vscode`, `cline`, `codex`; `--list`, `--local`).

Unity also publishes `Unity-Technologies/unity-agent-plugin` (official plugin,
skills only, ~29 skills) and `Unity-Technologies/skills` (standalone, via
`npx skills add`). Neither is vendored here.
