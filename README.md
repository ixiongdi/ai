# AI 最佳实践

个人在 AI 使用上的最佳实践整理，按场景分为三类。

## 目录

| 目录 | 说明 |
|------|------|
| [chat](chat/) | 如何与 AI 聊天 |
| [code](code/) | 如何用 AI 编码 |
| [work](work/) | 如何用 AI 工作 |

## Plugin 市场

本仓是 [Agent Plugins](https://agent-plugins.org/) 市场 **ixiongdi-ai**。两个独立 plugin，按需安装；不把别人的源码拷进本仓。

| plugin | 目录 | 说明 |
|--------|------|------|
| `ixiongdi` | [code/](code/) | 本仓工作流 Skills + id-generator MCP |
| `zvec` | [plugins/zvec/](plugins/zvec/) | 官方 Zvec Skill 用法 + MCP（`uvx zvec-mcp-server`） |

```bash
codex plugin marketplace add ixiongdi/ai
```

然后在 Plugins Directory 分别安装。Cursor：Customize 装本仓里的 `ixiongdi` 或 `zvec`。

Claude Code 不加载 Agent Plugins。`ixiongdi` 的 Skill 软链见 [code/README.md](code/README.md)。
