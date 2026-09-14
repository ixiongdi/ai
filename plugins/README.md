# Marketplace plugins

本仓是市场 **ixiongdi-ai**，遵循 [Agent Plugins 1.0](https://agent-plugins.org/) 与 [Agent Skills](https://agentskills.io/) 标准，包含 20 个独立 Plugin。

| 目录 | plugin `name` | 说明 |
| ---- | ------------- | ---- |
| [../code/](../code/) | `ixiongdi` | 本仓工作流 Skills (V-model, Clean Code, optimize-prompt, ID) + id-generator MCP |
| [zvec/](zvec/) | `zvec` | Zvec 向量数据库 Skill + `uvx zvec-mcp-server` MCP |
| [unity/](unity/) | `unity` | Unity CLI 为主（`unity mcp`）+ 官方 Skill 路由；relay 启动器保留为 fallback |
| [unreal/](unreal/) | `unreal` | UE 5.8 官方 MCP（HTTP）+ Epic 官方 Skill 路由 |
| [godot/](godot/) | `godot` | 社区 MCP（GoPeak `npx -y gopeak`）+ Skill；Godot 无官方实现 |
| [blender/](blender/) | `blender` | Blender Lab 官方 MCP（`uv run blender-mcp`）+ Skill |
| [pencil/](pencil/) | `pencil` | 仅 Skills：pen.dev 自行写入 MCP 配置，收录连接与工作流 |
| [cesium/](cesium/) | `cesium` | 社区 MCP（`npx -y cesium-mcp-runtime`）+ Skill；官方方案写进 Skill |
| [ponytail/](ponytail/) | `ponytail` | 极简主义 Lazy Senior Dev 模式与代码减重 Skills |
| [superpowers/](superpowers/) | `superpowers` | 软件工程实践框架：TDD、系统化根因调试、架构与执行计划、子智能体协作 |
| [mattpocock/](mattpocock/) | `mattpocock` | 真实工程实践技能：Grilling 压力测试、规格转工单、TDD、代码审查、领域建模 |
| [karpathy-skills/](karpathy-skills/) | `karpathy-skills` | Andrej Karpathy 总结的大模型编程陷阱与认知偏见防范行为准则 |
| [anthropic-skills/](anthropic-skills/) | `anthropic-skills` | Anthropic 官方实用技能集：PDF/Word/Excel/PPT 生成编辑、前端设计、MCP 构建器、Web 测试 |
| [ui-ux-pro-max/](ui-ux-pro-max/) | `ui-ux-pro-max` | 专业级 UI/UX 设计智能：79 种设计风格、192 套配色、74 组字体、22 种技术栈 |
| [graphify/](graphify/) | `graphify` | 代码库与文档知识图谱化：确定性 AST 解析、GraphRAG、社区发现与关系检索 |
| [browser-use/](browser-use/) | `browser-use` | 智能体浏览器自动化控制、端到端 Web QA、无头浏览器与云端环境访问 |
| [ecc/](ecc/) | `ecc` | Everything Claude Code：智能体性能优化、架构评估、闭环测试等 290+ 技能 |
| [gstack/](gstack/) | `gstack` | Garry Tan 完整团队角色体系：CEO 商业审查、架构评审、设计审查、QA 与自动化 Ship |
| [awesome-design-md/](awesome-design-md/) | `awesome-design-md` | 74 款知名品牌设计系统规范 (DESIGN.md 标准)：Linear、Vercel、Stripe、Claude、Apple 等 |
| [agency-agents/](agency-agents/) | `agency-agents` | 完整 AI 专家团队架构：18 个部门（工程、设计、产品、安全、测试等）、270+ 个深度定制的专家 Persona |

统一原则：**不把上游源码拷进本仓**。MCP 一律通过官方发行渠道拉取或直连运行中的宿主，Skill 用 URL 指向上游。各插件保持独立解耦与便携标准化，按需加载，不混装冗余私有宿主钩子。

## 上游与官方状态

| 上游 | 官方 MCP | 官方 Skill | 本 plugin 的处理 |
| ---- | -------- | ---------- | ---------------- |
| Zvec | 有（`zvec-mcp-server`，PyPI） | 有 | `mcp.json` 走 `uvx` |
| Unity | 有，但 **2.18 起官方标记废弃**，转向 Unity CLI（CLI 自身也带 `unity mcp` + `unity skill install`） | 有（`unity-agent-plugin`、`Unity-Technologies/skills`，另有 `unity skill install`） | `mcp.json` 走 **CLI 路径**（`unity mcp`）；废弃的 relay 启动器保留为 fallback |
| Unreal | 有（引擎内置 `ModelContextProtocol`，UE 5.8 Experimental） | 有（`EpicGames/unreal-engine-skills-for-claude-code-plugin`） | 直连 `127.0.0.1:8000/mcp` |
| Godot | **没有** | **没有** | `mcp.json` 接社区最优实现（GoPeak），Skill 里写清它为何胜出、setup gates、以及零插件备选 |
| Blender | 有（Blender Lab，需 5.1+ 与 add-on + uv） | 无 SKILL.md，改为连接时下发 `prompts.yml` + 内置 RST 文档检索 | `mcp.json` 走 uv 启动器 |
| pen.dev | 有（本地 stdio） | 服务端下发，用 `read_skill` / `get_style` 读 | 不放 `mcp.json`；plugin 名为 `pencil`，即客户端里显示的服务名 |
| Cesium | 有（`CesiumGS/cesium-ai-integrations`，官方 org，Apache-2.0） | 有，1 个（`cesium-context7`） | 官方定位是 reference/experiments、需 clone + pnpm build 且未上 npm，故 `mcp.json` 接社区 `cesium-mcp-runtime`；官方流程完整写进 Skill |

### 值得记住的三个判断

**为什么 Unity 和 Blender 需要启动器脚本。** 两者的 MCP 都依附于宿主安装的产物，而不是一个可以从注册表拉起的固定入口：Unity 的 relay 二进制由 Editor 的 `com.unity.ai.assistant` 包装到 `~/.unity/relay/`（含用户名、macOS 还分架构），Blender 的 `blender-mcp` 是 clone 里的 Python 项目、要用 `uv --directory` 起。硬编码路径必然失效，所以统一写 `scripts/*.mjs` 做平台解析，并支持环境变量覆盖。

**为什么只有 `pencil` 没有 `mcp.json`。** pen.dev 有官方 MCP，但配置由它自己写入（指向随版本变化的扩展内二进制 + 每次会话分配的 WebSocket 端口），我们写任何静态配置都会在下一次更新后失效并与它冲突——这种"没有"是被动的，不能靠补一个文件解决。Godot 恰好相反：官方两手皆空，所以是主动选一个社区实现。

**关于 `pencil` 这个 plugin 名。** 产品叫 **pen.dev**，是从 **Pencil** 改的名；但 MCP 服务保留了旧名，注册为 `pencil`，也就是客户端服务器列表里实际显示的那个字符串。plugin 取名 `pencil` 是为了对齐用户真正看到的东西，而不是对齐营销名。

**"有官方"不等于"能用官方"。** Cesium 是第一个官方存在、但我们没用官方的例子，判据是两条：能不能从注册表一行拉起，以及是不是成品级。Cesium 官方那套都在 `CesiumGS` org 里、Apache-2.0、社区论坛公告过——是真官方；但它自称 "reference integrations and experiments"，安装要 clone + `pnpm install && pnpm run build`（`@cesium-mcp/*` 不是发布的包，注册表 404），还有 Node >= 22 的硬门槛。同一件事社区版 `npx -y cesium-mcp-runtime` 就位，所以默认走社区，官方流程如实写进 Skill 并说明何时该选它。**结论：判断依据是可用性，不是"官方"这两个字。**

**Godot 的选型标准（按本仓约束排序）**：能不能从注册表一行拉起（而不是 `git clone && npm install && npm run build`）→ 还在不在发版 → 会不会把上百个工具 schema 一次性塞满上下文。GoPeak 三条都满足，并且是 star 最高那版（Coding-Solo）的超集，所以 `mcp.json` 接了它；零插件的 Coding-Solo 保留为备选写进 skill。选型理由和落选原因都记在 [godot/README.md](godot/README.md)，免得下次重新调研一遍。
