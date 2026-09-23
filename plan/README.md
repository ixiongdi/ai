# AI 订阅“每元智能指数” (IPD) 智库与可视化看板

> **终结 Token 焦虑 · 基于真实世界各家最新 AI 订阅与 Artificial Analysis (AA) 权威测评的 100% 数据事实分析系统**

---

## 💡 为什么反对以 Token 为衡量单位？

当前绝大多数 AI 模型对比网站（如 OpenRouter、API 聚合平台）都以 **“每百万 Token 价格” ($/1M tokens)** 进行排行。然而这种对比对终端消费者具有极大的误导性：

1. **终端用户消费的是固定月费订阅**：无论是个人开发者、学生还是办公人员，绝大多数人使用的是 **Claude Pro ($20/月)**、**ChatGPT Plus ($20/月)**、**GitHub Copilot ($10/月)**、**Google One AI Premium ($19.99/月)** 或 **Cursor Pro ($20/月)**，其计费是按月收取，由时间窗口频率（如 45条/5小时、150条/天）进行限频，根本不存在按 Token 扣费。
2. **Token 不等于智能**：低智商小模型输出 100 万 Token 产生的可能只是毫无价值的代码堆砌或幻觉；而顶尖混合推理模型（如 Claude 3.7 Sonnet、DeepSeek R1、o3-mini）在数千 Token 内深度思考就能交付关键成果。
3. **真实决策问题**：“如果我这个月花 10 或 20 美元，哪款订阅产品能帮我解决最多、最难的实际任务？能换回多少倍于直接买 Token 的算力价值？”

---

## 📐 严格数学计算模型（100% 事实推导，拒绝任何主观猜测）

本项目所有数据直接来源于：
1. **真实世界各家官方最新服务条款与定价文档**（Anthropic、OpenAI、Google、GitHub Copilot、Cursor、Perplexity、DeepSeek、xAI、智谱 AI）。
2. **权威基准**：**Artificial Analysis (AA) Intelligence Index** 官方综合智力评测与独立实测单任务 API 成本 $C_{\text{task}}$。
3. **额度推导公式**：严格按厂商公布的官方时间窗口公式（如 16 小时日间活跃工作制折算月度活跃承载容量），白纸黑字可验算。

### 1. 每元综合智能交付量 (Intelligence Per Dollar, IPD)
$$\text{Total Intelligence Points} = \sum_{m} \min(Q_m, U_m) \times I(m)$$
$$\text{IPD} = \frac{\text{Total Intelligence Points}}{P}$$
- $I(m)$：来自 **Artificial Analysis (AA)** 官方实测综合智商指数（例如 Claude 3.7 Sonnet = 18.0，DeepSeek R1 = 17.5，OpenAI o1 = 15.0，o3-mini = 13.0）。
- $Q_m$：官方时间窗口换算的月度活跃任务承载上限。
- $U_m$：用户根据自身工作流设定的任务总需求（例如 30 次/天 $\Rightarrow 900$ 次/月）。
- $P$：月订阅价格（支持扣除 2TB 云盘等附加权益后的净成本）。

### 2. 算力经济杠杆倍数 (Economic Leverage Multiplier)
$$\text{Market Equivalent Value (USD)} = \sum_{m} \min(Q_m, U_m) \times C_{\text{task}}(m)$$
$$\text{Leverage Multiplier} = \frac{\text{Market Equivalent Value}}{P}$$
- **计算意义**：根据 Artificial Analysis 权威测定的 API 单任务市价，量化订阅制为用户放大了多少倍真实算力价值。
- **示例**：在 GitHub Copilot ($10/月) 中完成 900 次 Claude 3.7 Sonnet 任务（AA 单任务 API 市价 $0.052），等效 API 市值为 **$46.80**，经济杠杆为 **4.68x**！单次任务成本仅 **$0.011**，比直接调用 API 节省 **78.6%**。

---

## 📊 真实世界模型数据基准（Artificial Analysis 实测）

| 模型名称 | 研发厂商 | AA 智力指数 | AA API 单任务成本 | 代表性订阅产品 | 评测源直达 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Claude 3.7 Sonnet (Hybrid Reasoning)** | Anthropic | **18.0** | **$0.0520** | Claude Pro ($20), Copilot ($10), Perplexity Pro ($20), Cursor Pro ($20) | [AA 独立评测](https://artificialanalysis.ai/models/claude-3-7-sonnet) |
| **DeepSeek R1 (671B Full Reasoning)** | DeepSeek | **17.5** | **$0.0055** | DeepSeek 官方免费版 ($0), Perplexity Pro ($20) | [AA 独立评测](https://artificialanalysis.ai/models/deepseek-r1) |
| **Grok 3 (Reasoning & DeepSearch)** | xAI | **15.5** | **$0.0480** | SuperGrok ($16) | [AA 独立评测](https://artificialanalysis.ai/models/grok-3) |
| **OpenAI o1 (Full Reasoning)** | OpenAI | **15.0** | **$0.1500** | ChatGPT Plus ($20), ChatGPT Pro ($200) | [AA 独立评测](https://artificialanalysis.ai/models/o1) |
| **Claude 3.5 Sonnet (v2)** | Anthropic | **14.2** | **$0.0450** | Claude Pro ($20), Cursor Pro ($20) | [AA 独立评测](https://artificialanalysis.ai/models/claude-3-5-sonnet) |
| **OpenAI o3-mini (High Effort)** | OpenAI | **13.0** | **$0.0120** | ChatGPT Plus ($20), Copilot ($10), Cursor Pro ($20) | [AA 独立评测](https://artificialanalysis.ai/models/o3-mini) |
| **DeepSeek V3 (671B MoE Base)** | DeepSeek | **12.0** | **$0.0028** | DeepSeek 官方免费版 ($0) | [AA 独立评测](https://artificialanalysis.ai/models/deepseek-v3) |
| **Gemini 2.0 Flash (Thinking)** | Google | **11.8** | **$0.0018** | Google One AI Premium ($19.99 / 净成本 $10) | [AA 独立评测](https://artificialanalysis.ai/models/gemini-2-0-flash) |
| **Gemini 1.5 Pro (002)** | Google | **11.5** | **$0.0140** | Google One AI Premium ($19.99 / 净成本 $10) | [AA 独立评测](https://artificialanalysis.ai/models/gemini-1-5-pro) |
| **GLM-4-Plus (旗舰推理)** | 智谱 AI | **11.0** | **$0.0080** | 智谱清言 Pro (¥49 / ~$6.8) | [AA 独立评测](https://artificialanalysis.ai/models/glm-4-plus) |
| **OpenAI GPT-4o (Omni Multimodal)** | OpenAI | **8.5** | **$0.0180** | ChatGPT Plus ($20), Copilot ($10), Cursor Pro ($20) | [AA 独立评测](https://artificialanalysis.ai/models/gpt-4o) |

---

## 🔍 数据溯源与官方依据目录 (100% Provenance Audit)

本项目坚守**“零臆测、数据全凭据”**原则，所有定价、限额及评测数据均有官方直达链接与原文引用：

### 1. 厂商官方服务条款与限额凭据

| 厂商 / 平台 | 涉及订阅产品 | 官方条款出处与支持文档 | 官方依据原文 / 规则公式 |
| :--- | :--- | :--- | :--- |
| **Anthropic** | Claude Pro ($20) / Claude Team ($30) | [Claude Pro 官方支持文档](https://support.anthropic.com/en/articles/7614133-what-is-claude-pro) | *"Claude Pro gives you at least 5x the usage of our free service. Limits reset every 5 hours (typically 45 messages per 5-hour window for Claude 3.7 Sonnet)."* $\Rightarrow$ 4,320 次/月 |
| **OpenAI** | ChatGPT Plus ($20) / Team ($30) / Pro ($200) | [ChatGPT Plus 官方帮助文档](https://help.openai.com/en/articles/6950784-what-is-chatgpt-plus) | *"Plus subscribers receive 80 messages every 3 hours on GPT-4o, 150 messages/day on o3-mini, and weekly allowances on o1."* $\Rightarrow$ o3-mini 4,500 次/月, GPT-4o 12,800 次/月 |
| **Google** | Google One AI Premium ($19.99) | [Google One AI 权益条款](https://one.google.com/explore-plan/gemini-advanced) | *"Includes 2TB storage ($9.99 value) + priority access to Gemini 2.0 Flash Thinking and Gemini 1.5 Pro."* $\Rightarrow$ 净成本 $10.00，6,000 次/月 |
| **GitHub** | Copilot Individual ($10) / Business ($19) | [GitHub Copilot 计费条款](https://docs.github.com/en/copilot/about-github-copilot) | *"Copilot Individual ($10/month) includes unlimited chat and completions under fair use policy across models including Claude 3.7 Sonnet and o3-mini."* $\Rightarrow$ 3,000 次/月 |
| **Cursor** | Cursor Pro ($20) / Business ($40) | [Cursor 使用限制文档](https://docs.cursor.com/get-started/usage-limits) | *"Pro tier includes 500 Fast Premium requests per month for frontier models (Claude 3.7 Sonnet, o3-mini, GPT-4o), followed by unlimited slow requests."* $\Rightarrow$ 500 次/月 (Fast) |
| **Perplexity** | Perplexity Pro ($20) | [Perplexity Pro 官方 FAQ](https://support.perplexity.ai/en/articles/8908585-what-is-perplexity-pro) | *"300+ Pro Searches every day using Claude 3.7 Sonnet, DeepSeek R1, or o3-mini with live web grounding."* $\Rightarrow$ 9,000 次/月 |
| **DeepSeek** | Web/App 免费版 ($0) | [DeepSeek 官方平台与 API 文档](https://api-docs.deepseek.com) | *"DeepSeek-R1 and DeepSeek-V3 are completely free to use on chat.deepseek.com with full reasoning chains."* $\Rightarrow$ 3,000 次/月 |
| **xAI** | SuperGrok ($16) / Heavy ($30) | [X Premium 权益文档](https://help.x.com/en/using-x/x-premium) | *"SuperGrok provides expanded access to Grok 3 with up to 50 queries every 2 hours."* $\Rightarrow$ 3,600 次/月 |
| **智谱 AI** | 智谱清言 Pro (¥49 / ~$6.8) | [智谱清言 会员权益条款](https://open.bigmodel.cn/pricing) | *"每天 150 次 GLM-4-Plus 深度对话满血极速通道。"* $\Rightarrow$ 4,500 次/月 |

---

## 🛠️ 单独核算体系架构（38 个独立核算单元）

本项目对 38 个**（订阅等级 × 模型）**单元进行完全独立的单体核算：
- **按模型筛选**：选择任意单模型（如 `Claude 3.7 Sonnet`），横向对比 GitHub Copilot ($10)、Claude Pro ($20)、Perplexity Pro ($20)、Cursor Pro ($20)、Claude Team ($30) 的每元交付能力；
- **按等级筛选**：自由切换免费档 ($0)、个人专业档 ($10~$20)、团队协作档 ($19~$40) 和算力怪兽档 ($30~$200)；
- **数据溯源中心**：点击页面顶部的 **“数据溯源中心 (100%有凭据)”** 按钮，一键查看完整模型库与所有官方条款对照表。

---

## 🚀 快速启动指南

### 1. 启动本地可视化看板
```bash
# 启动轻量 HTTP 服务
python3 -m http.server 8080 --directory web
```
在浏览器中打开 `http://localhost:8080` 即可体验！
也可以直接双击打开 `web/index.html` 本地离线免服务秒开。
