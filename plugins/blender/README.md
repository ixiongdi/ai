# blender

Blender's official MCP server, from [Blender Lab](https://www.blender.org/lab/mcp-server/).

| File | Contents |
| ---- | -------- |
| [plugin.json](plugin.json) | plugin manifest |
| [mcp.json](mcp.json) | starts `blender-mcp` through the uv launcher |
| [scripts/blender-mcp.mjs](scripts/blender-mcp.mjs) | resolves the `blender_mcp` clone and runs `uv --directory <repo>/mcp run blender-mcp` |
| [skills/blender/SKILL.md](skills/blender/SKILL.md) | add-on setup, the tool set, working rules, security |

Nothing from Blender is vendored. The server is a Python project inside the
`blender_mcp` clone; the add-on installs from Blender's own extension system.

**Blender has no built-in LLM connection.** Three pieces are needed and this
plugin only supplies the middle one:

1. the MCP Server add-on, installed in Blender 5.1+ and started from its
   preferences panel
2. this launcher, which needs `uv` on `PATH` and a `blender_mcp` clone
3. your MCP client

The launcher looks for the clone at `C:\blender_mcp` (Windows) or
`$HOME/blender_mcp`, matching the official instructions; set `BLENDER_MCP_DIR`
to override. Without a clone or `uv` it exits with the exact commands to fix it.

Blender's own warning: the server executes model-generated code in Blender with
no guards. Use a VM or a machine that does not hold sensitive data.
