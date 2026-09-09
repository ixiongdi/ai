# Marketplace plugins

本仓是市场 **ixiongdi-ai**，两个独立 [Agent Plugin](https://agent-plugins.org/)。

| 目录 | plugin `name` | 内容 |
| ---- | ------------- | ---- |
| [../code/](../code/) | `ixiongdi` | 本仓工作流 Skills + id-generator MCP |
| [zvec/](zvec/) | `zvec` | Zvec Skill + `uvx zvec-mcp-server`；不拷贝上游仓 |

上游 [zvec-agent-skills](https://github.com/zvec-ai/zvec-agent-skills) 与 [zvec-mcp-server](https://github.com/zvec-ai/zvec-mcp-server) 在本 plugin 里合成一份；长文档按需读上游，MCP 从 PyPI 拉。
