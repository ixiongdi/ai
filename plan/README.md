# AI 订阅 × 模型价值账本

静态选型看板，以每个**付费计划 × 近期具体模型**为独立比较项。覆盖 AI 厂商、云平台与 Coding Agent，包括 OpenAI、Anthropic、Google、xAI、Meta、DeepSeek、QwenCloud、Z.AI、Xiaomi MiMo、Mistral、AWS、Microsoft、GitHub Copilot、Cursor、OpenCode、Qoder、Kilo、Augment、Warp、JetBrains、Tabnine、v0、Bolt、Lovable 与 Devin。付费计划没有精确型号证据时保留在覆盖目录，不做模型级推算。

## 技术栈

- Vue 3.6.0-rc.9 Vapor SFC：`<script setup lang="ts" vapor>` 与 `createVaporApp`。
- Vite+ 1.0.0-rc.0 提供开发、检查与生产构建命令；`vite.config.ts` 集中配置 Vue Vapor 插件。
- TypeScript 7.0.2 用于应用与配置源码。

Vue Vapor 与 Vite+ 当前使用预发布版本；依赖版本已精确锁定在 `package.json` 与 `package-lock.json`。由于 Vue 3.6 RC 的版本号不满足 Vue 插件声明的稳定版 peer 范围，npm 安装命令启用 legacy peer resolution。

## 数据与计算

`data/catalog.json` 是维护用的规范数据源。`npm run data:build` 使用 TypeScript 检查付费计划、三个月发布日期窗口、数据 ID 和来源，然后生成 `web/data/data.json`。它会为每条计划 × 模型组合计算标准场景 API 等值请求数、倍率与 AA IPD；对外公开公式的模型 Credits 和逐模型 API 预算另估算任务数及订阅 IPD。AA 尚未发布可比指标的新模型仍可列出 API 成本，但不会进入 IPD 排名。页面读取 JSON 中的预计算结果；修改 token 场景或计价周期时按相同公式实时重算。不生成 JavaScript 数据副本。SQLite 文件是旧版遗留数据，不参与看板。

`npm run data:refresh` 通过 OpenAI Codex TypeScript SDK 启动本机 Codex agent，每次联网复查主要 AI、云与 Coding Agent 厂商的付费档位，并扫描近三个月模型发布索引和厂商模型矩阵。agent 返回紧凑的数据补丁；TypeScript 将经校验的新计划、模型与来源合并到规范 catalog，再重新生成整份 `web/data/data.json`。工作流至少要求 24 次 live search、80 个已付费档位、24 家厂商与 5 条模型候选审计记录；低于覆盖门槛或来源未在本次运行中核验时拒绝写入。它需要本机 Codex 认证和 live web search。普通构建不需要联网 agent。

默认 API 场景为 10,000 输入 token、2,000 输出 token，不含缓存、工具调用、长上下文加价或多轮 agent 开销。AA 基准 IPD = Intelligence Index ÷ AA 单任务 API 成本。Copilot 等美元 Credits 按 API 单价折算；MiMo/Z.AI 的模型 Credits 按官方 token 公式折算；OpenCode Go 按每个模型的月度 API cap 折算。每项都显示为场景估算，不代表套餐只会有这些调用。月费 API 等值是购买力基准，不代表套餐包含这些调用。Kiro credits 和倍率单独显示，不推测请求数。`meta.modelAudit` 保留窗口外或无精确套餐授权模型的排除原因。

人民币价格按 `catalog.json` 记录的欧洲央行交叉汇率折算。模型窗口、地区、来源和价格段均由 catalog 提供。

## 开发命令

从仓库根目录运行：

```bash
npm run data:build
npm install --legacy-peer-deps
npm run dev
npm run check
npm run build
npm run preview
```

更新官网数据时运行 `npm run data:refresh`；日常修改 catalog 后运行 `npm run data:build`。

`npm run dev` 启动 Vite+ 开发服务器；`npm run check` 执行 Vite+ 检查；`npm run build` 生成 `dist/` 静态站点。发布时同时部署 `dist/` 内的页面资源和 JSON。

## 更新数据

1. 每次刷新都重新检查主要 AI 厂商、云平台和 Coding Agent 的官方付费价目表与模型矩阵，不能只复制现有 catalog。
2. 只把真实发布日期在 `meta.windowStart` 至 `meta.asOf` 之间的模型加入 catalog，并记录 API 价格、AA 指数和直接来源。近期模型没有 AA 指数时保留 null 指标与原因，不移出发布日期统计。
3. 每个 `plans[].modelIds` 都需要套餐级型号访问证据。缺少对应证据的付费计划放在 `unpairedPlans`，写清原因，不推测模型级 IPD。
4. 更新日期、价格与来源后重新生成 JSON，并运行 `npm run check` 与 `npm run build`。
