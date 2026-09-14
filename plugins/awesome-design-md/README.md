# awesome-design-md

一个 Agent Plugin：官方 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)。

基于 Google Stitch 发起的 `DESIGN.md` 设计规范标准，收录 74 款业界知名产品与品牌的完整设计系统，为 AI 编程智能体提供持久、高保真、结构化的 UI 设计语料。

## 包含核心 Skill 与资源

- **Skill**: `design-md`
  - 检索与套用 74 款成熟品牌的设计语言（包含颜色 Token、字体梯度、卡片与输入框圆角/边框/阴影规范）。
  - 为当前项目生成定制化的 `DESIGN.md`。
- **内置设计系统库（74+）**：
  - **开发与科技**：`linear`、`vercel`、`cursor`、`claude`、`openai`、`github`、`supabase`、`raycast`、`resend`、`stripe`、`clerk`、`convex`、`notion`、`figma` 等。
  - **消费与企业级品牌**：`apple`、`airbnb`、`bmw`、`coinbase`、`binance`、`cal`、`replicate`、`perplexity` 等。
  - 存放在 `design-md/<brand>/DESIGN.md`。

## 使用方式

在已添加 **ixiongdi-ai** 市场的客户端（Codex、Cursor、ChatGPT 桌面版）中：
- Codex：`codex plugin add awesome-design-md@ixiongdi-ai`
- Cursor：Customize 中安装 `ixiongdi/ai` 里的 `awesome-design-md`，或开发软链到 `~/.cursor/plugins/local/awesome-design-md`
