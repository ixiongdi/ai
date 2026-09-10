# unity

Unity Editor agent tooling. One MCP server launcher plus one skill.

| File | Contents |
| ---- | -------- |
| [plugin.json](plugin.json) | plugin manifest |
| [mcp.json](mcp.json) | starts `unity-mcp` through the relay launcher |
| [scripts/unity-relay.mjs](scripts/unity-relay.mjs) | resolves the relay binary per platform and execs it with `--mcp` |
| [skills/unity/SKILL.md](skills/unity/SKILL.md) | MCP setup, targeting, approval, and routes to Unity's first-party skills |

Nothing from Unity is vendored. The relay binary is installed by the Unity Editor
itself (`com.unity.ai.assistant` writes it to `~/.unity/relay/`); the skills stay
in `Unity-Technologies/unity-agent-plugin` and `Unity-Technologies/skills`.

Prerequisites: Unity 6 (6000.0)+ with the `com.unity.ai.assistant` package, and
the Editor open on the project. The first external client must be approved in
**Edit > Project Settings > AI > Unity MCP Server**.

Multi-instance targeting and the deprecation of the MCP server in favor of the
Unity CLI are covered in the skill.
