# superpowers

一个 Agent Plugin：官方 [obra/superpowers](https://github.com/obra/superpowers) 的软件工程实践与 Agentic Skills 框架。

遵循 [Agent Plugins 1.0](https://agent-plugins.org/) 与 [Agent Skills](https://agentskills.io/) 标准，剥离上游多平台特定私有适配层，提供纯净便携的标准化 Skills。

## 包含核心 Skills

- `test-driven-development`: 测试驱动开发（先写失败测试，再写最小代码，严格红-绿-重构循环）
- `systematic-debugging`: 系统化根因调试（先查根因，拒绝治标不治本）
- `writing-plans`: 结构化实施计划编写（将大任务拆分为独立原子子任务）
- `executing-plans`: 计划执行与进度追踪
- `subagent-driven-development`: 基于子智能体驱动的分工协作开发
- `dispatching-parallel-agents`: 并行智能体分发与调度
- `brainstorming`: 需求发散与头脑风暴方案评审
- `requesting-code-review` / `receiving-code-review`: 代码审查发起与反馈接收
- `finishing-a-development-branch`: 分支开发收尾与清理
- `verification-before-completion`: 任务完成前的全面验证机制
- `using-git-worktrees`: Git worktree 多工作区并发隔离
- `using-superpowers`: 规则与技能自动检索应用门禁
- `writing-skills`: 新技能规范编写与维护

## 使用方式

在已添加 **ixiongdi-ai** 市场的客户端（Codex、Cursor、ChatGPT 桌面版）中：
- Codex：`codex plugin add superpowers@ixiongdi-ai`
- Cursor：Customize 中安装 `ixiongdi/ai` 里的 `superpowers`，或开发软链到 `~/.cursor/plugins/local/superpowers`
