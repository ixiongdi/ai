# mattpocock

一个 Agent Plugin：官方 [mattpocock/skills](https://github.com/mattpocock/skills)（Skills for Real Engineers）。

遵循 [Agent Plugins 1.0](https://agent-plugins.org/) 与 [Agent Skills](https://agentskills.io/) 标准，将上游工程与生产力分类展平为标准单一层级 Skills。

## 包含核心 Skills

### 工程技能（Engineering）
- `tdd`: 测试驱动开发模式
- `code-review`: 全面工程代码审查
- `codebase-design`: 代码库架构设计
- `diagnosing-bugs`: Bug 诊断与定位
- `domain-modeling`: 领域驱动建模
- `grill-with-docs`: 结合文档的深度质询审查
- `implement`: 严谨实现规范
- `improve-codebase-architecture`: 代码库架构演进与重构
- `prototype`: 快速原型验证
- `research`: 技术方案调研与验证
- `resolving-merge-conflicts`: Git 合并冲突解决
- `to-spec` / `to-tickets`: 需求到规范、规范到任务工单的转化流程
- `triage`: Issue/Bug 分流与定级
- `wayfinder` / `wizard` / `ask-matt`: 导航定位与工程答疑

### 生产力技能（Productivity）
- `grill-me` / `grilling`: 深度质问与方案压力测试
- `handoff`: 工作交接与上下文保存
- `teach`: 概念教学与知识传递
- `to-questionnaire`: 问卷与需求澄清清单
- `wait-what`: 逻辑校验与假设质疑
- `writing-for-agents`: 为 AI 编写高效 Prompt 与上下文

## 使用方式

在已添加 **ixiongdi-ai** 市场的客户端（Codex、Cursor、ChatGPT 桌面版）中：
- Codex：`codex plugin add mattpocock@ixiongdi-ai`
- Cursor：Customize 中安装 `ixiongdi/ai` 里的 `mattpocock`，或开发软链到 `~/.cursor/plugins/local/mattpocock`
