# zvec

一个 Agent Plugin：官方 Skill 的用法 + 官方 MCP，不把上游源码拷进本仓。

- MCP：[zvec-mcp-server](https://github.com/zvec-ai/zvec-mcp-server) 用 `uvx zvec-mcp-server` 启动
- Skill：本目录 `skills/zvec/SKILL.md` 只写何时用 MCP、何时写 SDK；长文档按需读上游 raw URL
- 密钥不进 `mcp.json`

需要 [uv](https://github.com/astral-sh/uv)。不要和 **ixiongdi** 合成一个 plugin。
