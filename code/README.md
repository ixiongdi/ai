# Code：如何用 AI 编码

沉淀用 AI 辅助编程的工作流、工具与约定。

本目录是 **一个 [Agent Plugin](https://agent-plugins.org/)**（`ixiongdi`）。只遵循三份开放标准：

| 标准 | 本目录里是什么 |
| ---- | -------------- |
| [Agent Plugins 1.0](https://agent-plugins.org/) | 根目录 `plugin.json` + `mcp.json` |
| [Agent Skills](https://agentskills.io/home) | `skills/*/SKILL.md` |
| [MCP](https://modelcontextprotocol.io) | `mcp/id-generator`（stdio；由 `mcp.json` 启动） |

不提供 Claude / Cursor / OpenAI 的私有组件（hooks、agents、commands、rules、LSP、`.mcp.json` 等）。仓库根的 marketplace 是**两个 plugin**：本项 `ixiongdi`，以及独立的 `zvec`（Skill + `uvx` MCP，不拷贝上游源码）。

不要把本仓 clone 进用户当前项目。

仓库：https://github.com/ixiongdi/ai.git

### For agent

```
Install Agent Plugin ixiongdi from https://github.com/ixiongdi/ai.git (plugin root is code/). Do not git clone into the user's working directory.

The package follows only Agent Plugins 1.0 + Agent Skills + MCP. No Claude/Cursor/OpenAI proprietary plugin components.

Clients that load Agent Plugins 1.0:
  Cursor: Customize → install from git repo ixiongdi/ai, or symlink code/ to ~/.cursor/plugins/local/ixiongdi and reload. Do not write ~/.cursor/skills-cursor/.
  Codex / ChatGPT desktop: codex plugin marketplace add ixiongdi/ai then install plugin ixiongdi from marketplace ixiongdi-ai. Optional separate plugin zvec (Zvec skill + uvx MCP; not vendored upstream source).

Clients that do not load Agent Plugins (including Claude Code):
  Use the skill symlink fallback (curl installer). Do not /plugin install.

MCP is stdio via node ./scripts/run-id-generator-mcp.mjs (cwd ${PLUGIN_ROOT}; builds dist on first run; Node.js 20+). ChatGPT web public directory cannot use this local stdio MCP.

Do not also symlink the same skills into ~/.cursor/skills if the plugin is installed.
```

### For human

**认 Agent Plugins 的客户端**（[Cursor](https://cursor.com/docs/plugins.md)、[Codex / ChatGPT 桌面](https://developers.openai.com/plugins/build/plugins)）

```bash
codex plugin marketplace add ixiongdi/ai
```

然后在 Plugins Directory 打开市场 **ixiongdi-ai**，按需安装 **ixiongdi**。Zvec 另装 **zvec**（Skill + MCP 已合成一个 plugin），不要和本 plugin 混成一个。

Cursor 也可 Customize 安装 git 仓库 `ixiongdi/ai`，或本仓开发：

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)/code" ~/.cursor/plugins/local/ixiongdi
```

然后 Developer: Reload Window。

MCP 第一次启动会 `npm install && npm run build`（日志在 stderr）。需要 Node.js 20+；没有 Node 时 Skills 仍可用。ChatGPT **网页**公开目录要公网 HTTPS MCP，本包是本地 stdio。

**不认 Agent Plugins 的客户端**（[Claude Code](https://code.claude.com/docs/en/plugins) 等）用下面的 Skill 软链，不要走 `/plugin install`。

#### 兜底：按 Agent Skills 目录软链

不要和上面的 Agent Plugin **同时**再软链同一套 Skill。

**Linux / macOS**

```bash
curl -fsSL https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.sh | bash
```

**Windows PowerShell**

```powershell
irm https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.ps1 | iex
```

只装某一个技能：`bash -s -- --skill id-generator --skip-mcp`。只注册用户级 MCP 配置：`--skip-skills`。本仓开发者：`bash code/install.sh`。

## Skills

| 路径 | 作用 |
| ---- | ---- |
| [skills/v-model](skills/v-model/) | 需求驱动交付：ConOps、成对测试设计、RTM、可选 IQ/OQ/PQ |
| [skills/clean-code](skills/clean-code/) | 按软件 V-model 九阶段做 Clean Code 全仓评审，以 CreatePlan 收尾 |
| [skills/id-generator](skills/id-generator/) | 语言无关的 ID 算法（entropy / UUIDv7 / Snowflake / ULID 等）；用 `scripts/` 里的 Python 生成或作为移植规格 |
| [skills/optimize-prompt](skills/optimize-prompt/) | 改写给 ChatGPT / Claude / Cursor 的用户提问（优化提示词）；不是系统提示或 Skill description |

## MCP

随 Agent Plugin 以本地 stdio 启动；id-generator 为 MCP **v2**（2026-07-28）。Host 若尚未支持该修订，可能连不上。

| 路径 | 作用 |
| ---- | ---- |
| [mcp/id-generator](mcp/id-generator/) | TypeScript MCP：Tools / Resources / Prompts。列出/推荐/解释算法、生成样例 ID；`idgen://catalog` 与决策树作上下文。样例不能替代生产环境的集群协调（worker / 共享计数器）。 |

Skill 提供算法与 Python 实现（任意语言项目都可跑脚本或移植 `generate.py`）；MCP 把同一套能力接到支持 2026-07-28 的 host。不要为了打印几个 ID 去克隆 Java 仓库。
