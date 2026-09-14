# ponytail

一个 Agent Plugin：官方 [DietrichGebert/ponytail](https://github.com/dietrichgebert/ponytail) 的极简主义高级开发模式（Lazy Senior Dev）。

遵循 [Agent Plugins 1.0](https://agent-plugins.org/) 与 [Agent Skills](https://agentskills.io/) 标准，不把上游私有适配层拷进本仓。

## 包含 Skills

- `ponytail`：核心惰性梯子（YAGNI → 现成代码 → 标准库 → 平台原生 → 单行 → 最少代码），支持 lite / full（默认）/ ultra
- `ponytail-review`：专查过度设计的代码审查，输出定位、精简建议与替换方案
- `ponytail-audit`：全仓库过度设计审计，输出减重清单
- `ponytail-debt`：收集与追踪 `ponytail:` 注释标记的技术债务账本
- `ponytail-gain`：基于基准测试的节省代码量/成本计分板
- `ponytail-help`：模式与指令速查卡

## 使用方式

在已添加 **ixiongdi-ai** 市场的客户端（Codex、Cursor、ChatGPT 桌面版）中：
- Codex：`codex plugin add ponytail@ixiongdi-ai`
- Cursor：Customize 中安装 `ixiongdi/ai` 里的 `ponytail`，或开发软链到 `~/.cursor/plugins/local/ponytail`

不要和 **ixiongdi** 或 **zvec** 合成一个 plugin。
