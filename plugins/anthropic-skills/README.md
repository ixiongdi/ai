# anthropic-skills

一个 Agent Plugin：官方 [anthropics/skills](https://github.com/anthropics/skills)。

Anthropic 官方开源的实用 Agent Skills 集合，涵盖复杂文档处理、前端与画布设计、MCP 构建器及测试验证。

## 包含核心 Skills

- **文档处理套件**：
  - `docx`: Word 格式文档生成、解析与编辑
  - `xlsx`: Excel 电子表格公式、数据透视与报表
  - `pptx`: PowerPoint 演示文稿生成与布局
  - `pdf`: 结构化 PDF 提取与生成
- **设计与前端**：
  - `frontend-design`: 现代化高质感 Web 前端设计
  - `canvas-design`: 画布与海报可视化设计
  - `theme-factory`: 配色与主题系统设计
  - `web-artifacts-builder`: 交互式 Web Artifacts 快速构建
- **工程与智能体构建**：
  - `mcp-builder`: MCP (Model Context Protocol) 插件及服务快速脚手架
  - `skill-creator`: 新 Agent Skill 标准模板创建与校验
  - `webapp-testing`: 端到端 Web 应用自动化测试
  - `claude-api`: Claude API 官方调用与最佳集成模式

## 使用方式

在已添加 **ixiongdi-ai** 市场的客户端（Codex、Cursor、ChatGPT 桌面版）中：
- Codex：`codex plugin add anthropic-skills@ixiongdi-ai`
- Cursor：Customize 中安装 `ixiongdi/ai` 里的 `anthropic-skills`，或开发软链到 `~/.cursor/plugins/local/anthropic-skills`
