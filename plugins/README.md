# Marketplace plugins

本仓是市场 **ixiongdi-ai**，八个独立 [Agent Plugin](https://agent-plugins.org/)。

| 目录 | plugin `name` | 内容 |
| ---- | ------------- | ---- |
| [../code/](../code/) | `ixiongdi` | 本仓工作流 Skills + id-generator MCP |
| [zvec/](zvec/) | `zvec` | Zvec Skill + `uvx zvec-mcp-server`；不拷贝上游仓 |
| [unity/](unity/) | `unity` | Unity MCP relay 启动器 + 官方 Skill 路由 |
| [unreal/](unreal/) | `unreal` | UE 5.8 官方 MCP（HTTP）+ Epic 官方 Skill 路由 |
| [godot/](godot/) | `godot` | 社区 MCP（GoPeak `npx -y gopeak`）+ Skill；Godot 无官方实现 |
| [blender/](blender/) | `blender` | Blender Lab 官方 MCP（`uv run blender-mcp`）+ Skill |
| [pencil/](pencil/) | `pencil` | 仅 Skills：pen.dev 自行写入 MCP 配置，收录连接与工作流 |
| [cesium/](cesium/) | `cesium` | 社区 MCP（`npx -y cesium-mcp-runtime`）+ Skill；官方方案写进 Skill |

统一原则：**不把上游源码拷进本仓**。MCP 一律通过官方发行渠道拉取或直连运行中的宿主，Skill 用 URL 指向上游。

## 上游与官方状态

| 上游 | 官方 MCP | 官方 Skill | 本 plugin 的处理 |
| ---- | -------- | ---------- | ---------------- |
| Zvec | 有（`zvec-mcp-server`，PyPI） | 有 | `mcp.json` 走 `uvx` |
| Unity | 有，但 **2.18 起被官方标记废弃**，转向 Unity CLI | 有（`unity-agent-plugin`、`Unity-Technologies/skills`） | `mcp.json` 走 relay 启动器；Skill 里写明废弃与替代 |
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
