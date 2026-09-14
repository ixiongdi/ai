# karpathy-skills

一个 Agent Plugin：官方 [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)。

源自 Andrej Karpathy 对大模型编程陷阱与认知偏见的观察总结，专注于减少大模型在编程中的常见失误。

## 包含 Skill

- `karpathy-guidelines`:
  - **Think Before Coding**: 不盲目假设、明确权衡、遇到歧义主动提问。
  - **Simplicity First**: 极简主义、拒绝过度抽象与过度配置。
  - **Surgical Changes**: 外科手术式精准修改，不破坏无关现有代码。
  - **Goal-Driven Execution**: 设定可量化的验证标准，完成后必须验证。

## 使用方式

在已添加 **ixiongdi-ai** 市场的客户端（Codex、Cursor、ChatGPT 桌面版）中：
- Codex：`codex plugin add karpathy-skills@ixiongdi-ai`
- Cursor：Customize 中安装 `ixiongdi/ai` 里的 `karpathy-skills`，或开发软链到 `~/.cursor/plugins/local/karpathy-skills`
