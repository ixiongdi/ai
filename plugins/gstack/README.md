# gstack

一个 Agent Plugin：官方 [garrytan/gstack](https://github.com/garrytan/gstack)（Garry Tan's Claude Code setup）。

将 Garry Tan 的全套工程方法论整合为标准 Agent Skills，扮演 CEO、设计师、工程经理、发布经理、文档工程师与 QA，覆盖从立项审查到一键发布的完整交付链路。

## 包含核心 Skills

- **规划与决策评审**：
  - `plan-ceo-review`: CEO 视角产品商业价值与定位审查
  - `plan-eng-review`: 工程经理架构可行性与复杂度审查
  - `plan-design-review`: 设计师体验与交互审查
  - `plan-devex-review`: 开发者体验与 API 易用性审查
  - `autoplan`: 自动化分步实施计划生成
- **交付与验证**：
  - `review`: 综合质量与安全代码审查
  - `qa`: 全方位回归测试与边界用例核验
  - `ship`: 自动化部署上线与发布清单核对
  - `retro`: 迭代复盘与技术债总结
- **辅助工具**：
  - `diagram`: 架构与流程图表绘制
  - `investigate`: 深度问题根因调查
  - `health`: 代码库健康度体检
  - `gstack`: 整体工作流总路由入口

## 使用方式

在已添加 **ixiongdi-ai** 市场的客户端（Codex、Cursor、ChatGPT 桌面版）中：
- Codex：`codex plugin add gstack@ixiongdi-ai`
- Cursor：Customize 中安装 `ixiongdi/ai` 里的 `gstack`，或开发软链到 `~/.cursor/plugins/local/gstack`
