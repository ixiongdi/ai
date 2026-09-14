# AI 最佳实践

个人在 AI 使用上的最佳实践整理，按场景分为三类。

## 目录

| 目录 | 说明 |
|------|------|
| [chat](chat/) | 如何与 AI 聊天 |
| [code](code/) | 如何用 AI 编码 |
| [work](work/) | 如何用 AI 工作 |

## Plugin 市场

本仓是 [Agent Plugins](https://agent-plugins.org/) 市场 **ixiongdi-ai**。遵循开放标准，包含 20 个独立 plugin，按需安装；保持轻量便携，不把别人的源码拷进本仓。

| plugin | 目录 | 说明 |
|--------|------|------|
| `ixiongdi` | [code/](code/) | 本仓工作流 Skills + id-generator MCP |
| `zvec` | [plugins/zvec/](plugins/zvec/) | 官方 Zvec 向量数据库 Skill + MCP（`uvx zvec-mcp-server`） |
| `unity` | [plugins/unity/](plugins/unity/) | Unity CLI 为主（`unity mcp`）+ 官方 Skill 路由；relay 保留为 fallback |
| `unreal` | [plugins/unreal/](plugins/unreal/) | UE 5.8 官方 MCP（HTTP）+ Epic 官方 Skill 路由 |
| `godot` | [plugins/godot/](plugins/godot/) | 社区 MCP（GoPeak `gopeak`）+ Skill；Godot 无官方实现 |
| `blender` | [plugins/blender/](plugins/blender/) | Blender Lab 官方 MCP（`uv run blender-mcp`）+ Skill |
| `pencil` | [plugins/pencil/](plugins/pencil/) | 仅 Skills：pen.dev 自行写入 MCP 配置，收录连接与工作流 |
| `cesium` | [plugins/cesium/](plugins/cesium/) | CesiumJS 社区 MCP runtime（`cesium-mcp-runtime`）+ Skill；官方方案写进 Skill |
| `ponytail` | [plugins/ponytail/](plugins/ponytail/) | 极简主义 Senior Dev 模式与代码减重 Skills |
| `superpowers` | [plugins/superpowers/](plugins/superpowers/) | 软件工程实践框架：TDD、系统化根因调试、计划制定与子智能体协作 |
| `mattpocock` | [plugins/mattpocock/](plugins/mattpocock/) | 真实工程师技能：Grilling 压力测试、规格转工单、TDD、代码审查 |
| `karpathy-skills` | [plugins/karpathy-skills/](plugins/karpathy-skills/) | Andrej Karpathy 大模型编程陷阱与认知偏见防范行为准则 |
| `anthropic-skills` | [plugins/anthropic-skills/](plugins/anthropic-skills/) | Anthropic 官方实用技能集：PDF/Word/Excel/PPT 生成编辑、前端设计、MCP 构建器 |
| `ui-ux-pro-max` | [plugins/ui-ux-pro-max/](plugins/ui-ux-pro-max/) | 专业级 UI/UX 设计智能：79 种设计风格、192 套配色、74 组字体搭配 |
| `graphify` | [plugins/graphify/](plugins/graphify/) | 代码库与文档知识图谱化：确定性 AST 解析、GraphRAG 与关系检索 |
| `browser-use` | [plugins/browser-use/](plugins/browser-use/) | 智能体浏览器自动化控制、端到端 Web QA 与无头浏览器 |
| `ecc` | [plugins/ecc/](plugins/ecc/) | Everything Claude Code：智能体性能优化、架构评估等 290+ 技能 |
| `gstack` | [plugins/gstack/](plugins/gstack/) | Garry Tan 完整团队角色体系：CEO 商业审查、架构评审、设计审查与自动化 Ship |
| `awesome-design-md` | [plugins/awesome-design-md/](plugins/awesome-design-md/) | 74 款知名品牌设计系统规范 (DESIGN.md 标准)：Linear、Vercel、Stripe、Claude、Apple 等 |
| `agency-agents` | [plugins/agency-agents/](plugins/agency-agents/) | 完整 AI 专家团队架构：18 个部门（工程、设计、产品、安全、测试等）、270+ 个深度定制的专家 Persona |

```bash
codex plugin marketplace add ixiongdi/ai
```

然后在 Plugins Directory 分别安装。Cursor：Customize 安装本仓各独立 plugin。详见 [plugins/README.md](plugins/README.md)。

Claude Code 不加载 Agent Plugins。`ixiongdi` 的 Skill 软链见 [code/README.md](code/README.md)。
