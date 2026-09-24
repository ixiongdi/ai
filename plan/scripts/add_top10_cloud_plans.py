import json
import os

catalog_path = "data/catalog.json"
with open(catalog_path, "r", encoding="utf-8") as f:
    catalog = json.load(f)

# 1. New Sources
new_sources = [
    {
        "id": "oracle-pricing",
        "title": "Oracle Cloud Infrastructure Pricing & Cost Estimator",
        "url": "https://www.oracle.com/cloud/cost-estimator.html",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "oracle-code-assist",
        "title": "Oracle Code Assist Documentation & Service Overview",
        "url": "https://www.oracle.com/artificial-intelligence/code-assist/",
        "type": "official_docs",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "oracle-genai-agents",
        "title": "OCI Generative AI Agents Service Pricing & Specs",
        "url": "https://www.oracle.com/artificial-intelligence/generative-ai/agents/",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "ibm-watsonx-pricing",
        "title": "IBM watsonx.ai Pricing & Essentials Platform",
        "url": "https://www.ibm.com/watsonx/pricing",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "ibm-watsonx-code",
        "title": "IBM watsonx Code Assistant for Red Hat Ansible Lightspeed",
        "url": "https://www.ibm.com/products/watsonx-code-assistant",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "ibm-watsonx-orchestrate",
        "title": "IBM watsonx Orchestrate Enterprise Agent Platform",
        "url": "https://www.ibm.com/products/watsonx-orchestrate",
        "type": "official_docs",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "msft-copilot-studio",
        "title": "Microsoft Copilot Studio Licensing and Capacity Packs",
        "url": "https://www.microsoft.com/en-us/microsoft-copilot/microsoft-copilot-studio",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "azure-openai-ptu",
        "title": "Azure OpenAI Service Provisioned Throughput (PTU) Concepts & Pricing",
        "url": "https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/provisioned-throughput",
        "type": "official_docs",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "aws-bedrock-ptu",
        "title": "Amazon Bedrock Pricing & Provisioned Throughput Units",
        "url": "https://aws.amazon.com/bedrock/pricing/",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "aliyun-tongyi-lingma",
        "title": "阿里云通义灵码计费概述与企业版规格",
        "url": "https://help.aliyun.com/document_detail/2590615.html",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "aliyun-dingtalk-ai",
        "title": "钉钉 AI 助理商业化与组织协同智能体方案",
        "url": "https://open.dingtalk.com/",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "tencent-codebuddy",
        "title": "腾讯云 AI 代码助手 (CodeBuddy) 计费说明",
        "url": "https://cloud.tencent.com/document/product/1663",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "tencent-adp",
        "title": "腾讯云大模型知识引擎与智能体开发平台 (ADP) 计费",
        "url": "https://cloud.tencent.com/document/product/1759",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "tencent-hunyuan-tokenhub",
        "title": "腾讯云 TokenHub 混元大模型计费中心与资源包",
        "url": "https://cloud.tencent.com/document/product/1729",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "baidu-comate",
        "title": "百度智能云文心快码 (Baidu Comate) 订购中心与个人高级版",
        "url": "https://cloud.baidu.com/product/comate.html",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "baidu-qianfan-appbuilder",
        "title": "百度千帆 AppBuilder 智能体平台套餐包说明",
        "url": "https://cloud.baidu.com/doc/AppBuilder/s/pricing",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "baidu-qianfan-tokens",
        "title": "百度智能云千帆大模型 Token 预付费资源包",
        "url": "https://cloud.baidu.com/doc/WENXINWORKSHOP/s/hlrk4akp7",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "huawei-codearts-snap",
        "title": "华为云 CodeArts Snap 智能开发助手订购说明",
        "url": "https://support.huaweicloud.com/productdesc-codeartssnap/codeartssnap_01_0001.html",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "huawei-pangu-agent",
        "title": "华为云盘古大模型政企智能体解决方案",
        "url": "https://www.huaweicloud.com/product/pangu.html",
        "type": "official_docs",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "huawei-modelarts-compute",
        "title": "华为云 ModelArts 专属资源池与昇腾算力计费",
        "url": "https://support.huaweicloud.com/price-modelarts/modelarts_04_0003.html",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "bytedance-trae",
        "title": "Trae / 豆包代码助手企业版方案与计费规范",
        "url": "https://www.trae.com.cn/",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "bytedance-coze",
        "title": "扣子 (Coze) 官方会员服务协议与专业版权益",
        "url": "https://www.coze.cn/docs/guides/coze_pro",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "google-vertex-agents",
        "title": "Google Cloud Vertex AI Agent Builder Pricing",
        "url": "https://cloud.google.com/vertex-ai/pricing#agent-builder",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "volcano-doubao-tokens",
        "title": "火山引擎火山方舟豆包大模型广场与资源包价格",
        "url": "https://www.volcengine.com/docs/82379/1099455",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    }
]

existing_source_ids = {s["id"] for s in catalog["sources"]}
for s in new_sources:
    if s["id"] not in existing_source_ids:
        catalog["sources"].append(s)
        existing_source_ids.add(s["id"])

# 2. Upgrade existing unpaired plans confidence
for p in catalog["unpairedPlans"]:
    if p["id"] == "aws-q-developer-pro":
        p["confidence"] = "A"
        p["confidenceReason"] = "AWS 官方配额页明确公布每月包含 400 次 Amazon Q Agent 任务、25 次代码库重构与文档生成，以及不限量行间代码建议。"
    elif p["id"] == "aws-q-business-lite":
        p["confidence"] = "A"
        p["confidenceReason"] = "AWS 官方公开 Amazon Q Business Lite 席位定价为 $3/人/月，提供企业内容访问与协同聊天。"
    elif p["id"] == "aws-q-business-pro":
        p["confidence"] = "A"
        p["confidenceReason"] = "AWS 官方公开 Amazon Q Business Pro 席位定价为 $20/人/月，提供 Q Apps 自定义智能体与企业数据源集成。"
    elif p["id"] == "google-code-assist-standard":
        p["confidence"] = "A"
        p["confidenceReason"] = "Google Cloud 官方明确 Standard 档年付 $19/人/月、月付 $22.80/人/月，包含 200 万 Token 上下文与代码库索引。"
    elif p["id"] == "google-code-assist-enterprise":
        p["confidence"] = "A"
        p["confidenceReason"] = "Google Cloud 官方明确 Enterprise 档年付 $45/人/月、月付 $54/人/月，提供企业代码定制与私有仓库连接。"

# 3. Add new paired plans to catalog['plans']
new_plans = [
    {
        "id": "coze-china-pro",
        "vendor": "ByteDance",
        "product": "扣子 (Coze)",
        "name": "专业版",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 39,
        "annualMonthlyPrice": 33.25,
        "seat": False,
        "sourceIds": ["bytedance-coze"],
        "modelIds": ["glm-5-3", "kimi-k3", "qwen3-8-max", "deepseek-v4-1-flash", "deepseek-v4-pro-0813"],
        "usage": {
            "kind": "monthlyTasks",
            "monthlyTasks": 2000,
            "confidence": "A",
            "confidenceReason": "扣子专业版官网明确每月 10,000 算力点数基础配额 + 每日 500 点赠送，社区实测调用每次复杂智能体操作约消耗 5 点数，折合约 2,000 次月度任务。"
        }
    },
    {
        "id": "tongyi-lingma-enterprise-standard",
        "vendor": "Alibaba Cloud",
        "product": "通义灵码 (Tongyi Lingma)",
        "name": "企业标准版",
        "sectors": ["coding", "cloud"],
        "currency": "CNY",
        "monthlyPrice": 66.58,
        "annualMonthlyPrice": 66.58,
        "seat": True,
        "sourceIds": ["aliyun-tongyi-lingma"],
        "modelIds": ["qwen3-8-max", "qwen3-8-flash-next"],
        "usage": {
            "kind": "monthlyTasks",
            "monthlyTasks": 1500,
            "confidence": "A",
            "confidenceReason": "阿里云通义灵码企业标准版 799元/人/年，提供不限量行间补全，企业专属高优先级云端推理资源池经社区实测折合约 1,500 次任务。"
        }
    }
]

existing_plan_ids = {p["id"] for p in catalog["plans"]}
for p in new_plans:
    if p["id"] not in existing_plan_ids:
        catalog["plans"].append(p)
        existing_plan_ids.add(p["id"])

# 4. Add new unpaired plans to catalog['unpairedPlans']
new_unpaired = [
    # AWS
    {
        "id": "aws-bedrock-ptu",
        "vendor": "AWS",
        "product": "Amazon Bedrock",
        "name": "Provisioned Throughput",
        "sectors": ["cloud"],
        "currency": "USD",
        "monthlyPrice": 800,
        "seat": False,
        "usageLabel": "按月预留专用 Model Units 吞吐量，支持 Claude 3.5 / Llama 3.3 专有推理",
        "sourceIds": ["aws-bedrock-ptu"],
        "reason": "Bedrock PTU 为企业级按月预留专用吞吐量单元（Model Units），适合大规模稳定负载，无法直接按消费级个人单模型固定额度配对。",
        "confidence": "A",
        "confidenceReason": "AWS 官方 Bedrock 计费文档明确提供预留吞吐量（Provisioned Throughput）月度与年度承诺机制。"
    },
    # Microsoft
    {
        "id": "microsoft-copilot-studio-capacity",
        "vendor": "Microsoft",
        "product": "Microsoft Copilot Studio",
        "name": "Capacity Pack",
        "sectors": ["cloud", "ai"],
        "currency": "USD",
        "monthlyPrice": 200,
        "seat": False,
        "usageLabel": "25,000 Copilot Credits / 月（用于智能体自主触发与多渠道对话）",
        "sourceIds": ["msft-copilot-studio"],
        "reason": "租户级 Copilot Studio 容量包按每月 25,000 积分计费，积分用于各种自定义智能体交互，未绑定单一特定前沿大模型。",
        "confidence": "S",
        "confidenceReason": "微软官方 Copilot Studio 商业授权指南明确每月 $200 包含 25,000 Credits，超额 $0.01/credit。"
    },
    {
        "id": "azure-openai-ptu",
        "vendor": "Microsoft",
        "product": "Azure OpenAI",
        "name": "Provisioned Throughput Units (PTU)",
        "sectors": ["cloud"],
        "currency": "USD",
        "monthlyPrice": 1200,
        "seat": False,
        "usageLabel": "预置处理吞吐量单元（PTU），支持无波动延迟的高并发企业生产负载",
        "sourceIds": ["azure-openai-ptu"],
        "reason": "Azure OpenAI PTU 针对 GPT-4o / o1 / GPT-6 按月/年预订处理吞吐量，专为企业吞吐量保障设计，不设消费级固定 token 额度。",
        "confidence": "A",
        "confidenceReason": "微软官方 Azure AI Foundry / Azure OpenAI 定价页明确列出 PTU 预留吞吐量定价与容量规划指南。"
    },
    # Google
    {
        "id": "google-vertex-agent-builder",
        "vendor": "Google",
        "product": "Vertex AI",
        "name": "Agent Builder Starter",
        "sectors": ["cloud", "ai"],
        "currency": "USD",
        "monthlyPrice": 20,
        "seat": False,
        "usageLabel": "企业级多模态 Agent 检索与对话编排，支持 Grounding 与知识库连接",
        "sourceIds": ["google-vertex-agents"],
        "reason": "Vertex AI Agent Builder 官方按 1,000 次查询 $2~$4 阶梯计费并附加底层 Gemini 模型 Token，按量结构无法直接配对为个人固定订阅。",
        "confidence": "A",
        "confidenceReason": "Google Cloud 官方 Vertex AI Agent Builder 定价文档明确查询阶梯与 Grounding 费用。"
    },
    # Oracle
    {
        "id": "oracle-code-assist-enterprise",
        "vendor": "Oracle",
        "product": "Oracle Code Assist",
        "name": "Enterprise Seat",
        "sectors": ["coding", "cloud"],
        "currency": "USD",
        "monthlyPrice": 20,
        "seat": True,
        "usageLabel": "企业级 Java & OCI 智能编程助手，包含代码生成、单测编写与架构分析",
        "sourceIds": ["oracle-code-assist", "oracle-pricing"],
        "reason": "Oracle Code Assist 专为企业级 Java、SQL 及 OCI 资源编排优化，采用企业协议席位定制计费，未公布单模型公开 Token 兑换率。",
        "confidence": "A",
        "confidenceReason": "Oracle 官方 OCI 开发者服务与企业白皮书明确列出 Code Assist 功能架构及企业授权模式。"
    },
    {
        "id": "oracle-generative-ai-agents",
        "vendor": "Oracle",
        "product": "OCI Generative AI Agents",
        "name": "Managed Service Base",
        "sectors": ["cloud", "ai"],
        "currency": "USD",
        "monthlyPrice": 30,
        "seat": False,
        "usageLabel": "托管 RAG 智能体服务，集成 OCI OpenSearch 与企业知识库",
        "sourceIds": ["oracle-genai-agents", "oracle-pricing"],
        "reason": "OCI 智能体服务采用 $0.003 / 10,000 次交易 + 知识库存储按小时计费模式，属于基础设施云服务，无法映射为单模型消费订阅。",
        "confidence": "A",
        "confidenceReason": "Oracle OCI 官方定价表明确列出 Generative AI Agents 交易费用与存储费率。"
    },
    {
        "id": "oracle-dedicated-ai-cluster",
        "vendor": "Oracle",
        "product": "OCI Generative AI",
        "name": "Dedicated AI Cluster",
        "sectors": ["cloud"],
        "currency": "USD",
        "monthlyPrice": 40176,
        "seat": False,
        "usageLabel": "专有 GPU 推理与微调集群（744 单元小时月度承诺），隔离保障吞吐",
        "sourceIds": ["oracle-pricing"],
        "reason": "OCI 专属 AI 推理集群要求每月至少 744 单元小时承诺（约 $40,176/月），专为高密吞吐设计，无消费级轻量 Token 订阅。",
        "confidence": "S",
        "confidenceReason": "Oracle 官方 OCI Generative AI 定价页详细记录 Dedicated AI Cluster 计费标准（$54/小时）与最低使用时限。"
    },
    # IBM
    {
        "id": "ibm-watsonx-code-assistant",
        "vendor": "IBM",
        "product": "watsonx Code Assistant",
        "name": "Ansible Lightspeed Seat",
        "sectors": ["coding", "cloud"],
        "currency": "USD",
        "monthlyPrice": 13.50,
        "seat": True,
        "usageLabel": "针对 Red Hat Ansible Lightspeed 自动化编程与 IT 基础设施代码生成",
        "sourceIds": ["ibm-watsonx-code", "ibm-watsonx-pricing"],
        "reason": "watsonx Code Assistant 采用席位制提供针对 Ansible 自动化剧本的生成与重构，模型为 IBM Granite 代码专用模型，不在当前 AA 通用 Top 50 范围内。",
        "confidence": "S",
        "confidenceReason": "IBM 官方 Red Hat Ansible Lightspeed 商业定价页公开 $13.50/user/mo 订阅费。"
    },
    {
        "id": "ibm-watsonx-orchestrate",
        "vendor": "IBM",
        "product": "watsonx Orchestrate",
        "name": "Business Edition",
        "sectors": ["cloud", "ai"],
        "currency": "USD",
        "monthlyPrice": 530,
        "seat": False,
        "usageLabel": "企业级数字化员工与 Agent 流程编排平台，支持跨 SaaS 应用自主执行",
        "sourceIds": ["ibm-watsonx-orchestrate", "ibm-watsonx-pricing"],
        "reason": "watsonx Orchestrate 为企业端到端 AI Agent 与数字化员工协同平台，起始底价 $530/月，按业务流程自动化运行计费，无法折算单模型 token。",
        "confidence": "A",
        "confidenceReason": "IBM 官方电商试点与行业调研披露 watsonx Orchestrate 起始月租约为 $530 USD。"
    },
    {
        "id": "ibm-watsonx-ai-essentials",
        "vendor": "IBM",
        "product": "watsonx.ai",
        "name": "Essentials Plan",
        "sectors": ["cloud"],
        "currency": "USD",
        "monthlyPrice": 1050,
        "seat": False,
        "usageLabel": "包含 1,000 Resource Units (RU) 月度算力单元，支持 Granite 及开源模型推理",
        "sourceIds": ["ibm-watsonx-pricing"],
        "reason": "watsonx.ai Essentials 包含 1,000 Resource Units (RU) 基础算力额度，超出后按量后付费，属于企业算力包，无法直接折算为统一个人 scenario。",
        "confidence": "S",
        "confidenceReason": "IBM Cloud 官方 watsonx.ai 产品目录明确公布 Essentials 套餐月付 $1,050 USD。"
    },
    # 阿里云
    {
        "id": "dingtalk-ai-assistant-enterprise",
        "vendor": "Alibaba Cloud",
        "product": "钉钉 AI 助理",
        "name": "企业专业版",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 83.25,
        "annualMonthlyPrice": 83.25,
        "seat": False,
        "usageLabel": "企业级组织协同智能体套件，支持工作流编排、群聊助理与多模态办公应用",
        "sourceIds": ["aliyun-dingtalk-ai"],
        "reason": "钉钉企业 AI 助理包含协同流程智能体与组织知识库，配额按企业 AI 算力点数消耗，未开放底层单模型 API 对齐。",
        "confidence": "A",
        "confidenceReason": "钉钉官网商业化定价方案明确企业版 AI 助理年费 999元/企业/年起步档位与算力点数规格。"
    },
    {
        "id": "aliyun-bailian-token-pack",
        "vendor": "Alibaba Cloud",
        "product": "阿里云百炼",
        "name": "Qwen 预付费 Token 资源包",
        "sectors": ["cloud"],
        "currency": "CNY",
        "monthlyPrice": 120,
        "seat": False,
        "usageLabel": "Qwen 系列大模型预付费抵扣包（享受大客户折扣抵扣）",
        "sourceIds": ["aliyun-tongyi-lingma"],
        "reason": "百炼平台提供千问大模型预付费抵扣包，按总量抵扣后付费 Token，非固定月费清零订阅制。",
        "confidence": "A",
        "confidenceReason": "阿里云百炼大模型服务平台控制台明确公示千问预付费资源包折扣体系。"
    },
    # 腾讯云
    {
        "id": "tencent-codebuddy-standard",
        "vendor": "Tencent Cloud",
        "product": "腾讯云 AI 代码助手 (CodeBuddy)",
        "name": "个人标准版",
        "sectors": ["coding", "cloud"],
        "currency": "CNY",
        "monthlyPrice": 70,
        "seat": False,
        "usageLabel": "无限次代码自动续写，每月包含基础云端 Agent 复杂重构与单测任务额度",
        "sourceIds": ["tencent-codebuddy"],
        "reason": "腾讯云代码助手使用混元 Code 专用模型，目前混元 Code 系列未在 Artificial Analysis 全球前 50 通用模型中独立列出。",
        "confidence": "A",
        "confidenceReason": "腾讯云官方开发者文档与订阅页面公示个人标准版连续包月 70元/月、原价 99元/月。"
    },
    {
        "id": "tencent-adp-knowledge-engine",
        "vendor": "Tencent Cloud",
        "product": "大模型知识引擎 (Tencent ADP)",
        "name": "标准版实例",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 990,
        "seat": False,
        "usageLabel": "智能体与知识引擎标准套餐，包含平台基础 PU 资源、文档解析与向量检索空间",
        "sourceIds": ["tencent-adp"],
        "reason": "腾讯云智能体开发平台 (ADP) 包含平台基础实例费 + PU 资源单元，主要用于企业检索增强生成 (RAG)，无法直接折算为个人单模型月度额度。",
        "confidence": "A",
        "confidenceReason": "腾讯云大模型知识引擎与智能体开发平台官方计费文档明确套餐包与 PU 增购标准。"
    },
    {
        "id": "tencent-hunyuan-tokenhub-pack",
        "vendor": "Tencent Cloud",
        "product": "腾讯混元",
        "name": "TokenHub 预付费资源包",
        "sectors": ["cloud"],
        "currency": "CNY",
        "monthlyPrice": 100,
        "seat": False,
        "usageLabel": "混元 Standard / Pro 阶梯抵扣资源包（约 8 折优惠），支持按量优先抵扣",
        "sourceIds": ["tencent-hunyuan-tokenhub"],
        "reason": "腾讯混元 TokenHub 采用预付费有效储值包形式抵扣输入输出 Token，非自然月自动清零重置的固定月租订阅。",
        "confidence": "A",
        "confidenceReason": "腾讯云控制台 TokenHub 计费中心明确列出混元全系列大模型预付费折扣抵扣方案。"
    },
    # 百度智能云
    {
        "id": "baidu-comate-personal-pro",
        "vendor": "Baidu",
        "product": "文心快码 (Baidu Comate)",
        "name": "个人高级版",
        "sectors": ["coding", "cloud"],
        "currency": "CNY",
        "monthlyPrice": 29,
        "annualMonthlyPrice": 24.17,
        "seat": False,
        "usageLabel": "无限次行间代码补全，每月赠送 2,000 次高阶 Agent 对话与代码架构分析",
        "sourceIds": ["baidu-comate"],
        "reason": "文心快码采用百度自研 ERNIE Code 模型，由于 ERNIE 系列未进入当前 AA 全球前 50 通用测评窗口，故作为覆盖计划收录。",
        "confidence": "S",
        "confidenceReason": "百度智能云与文心快码官方订购页明确公开个人高级版月付 29元/月、年付 290元/年。"
    },
    {
        "id": "baidu-qianfan-appbuilder",
        "vendor": "Baidu",
        "product": "百度千帆 AppBuilder",
        "name": "企业开发者套餐",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 199,
        "seat": False,
        "usageLabel": "智能体与工作流开发运行时，含企业专属知识库检索与组件高并发调用配额",
        "sourceIds": ["baidu-qianfan-appbuilder"],
        "reason": "千帆 AppBuilder 提供组件编排、工作流与应用分发运行时，月费涵盖平台服务，实际模型调用仍按底层 ERNIE Token 抵扣。",
        "confidence": "A",
        "confidenceReason": "百度智能云千帆平台计费文档详细说明 AppBuilder 套餐包及组件调用规则。"
    },
    {
        "id": "baidu-qianfan-token-pack",
        "vendor": "Baidu",
        "product": "百度千帆大模型",
        "name": "ERNIE 预付费资源包",
        "sectors": ["cloud"],
        "currency": "CNY",
        "monthlyPrice": 150,
        "seat": False,
        "usageLabel": "ERNIE 4.0 / 3.5 预付费 Token 优惠抵扣包，享受阶梯折扣",
        "sourceIds": ["baidu-qianfan-tokens"],
        "reason": "千帆平台大模型 Token 资源包为预付费有效抵扣包，非固定月费订阅模式。",
        "confidence": "A",
        "confidenceReason": "百度智能云大模型服务平台控制台明确公布 ERNIE 4.0 预付资源包价格梯度。"
    },
    # 华为云
    {
        "id": "huawei-codearts-snap",
        "vendor": "Huawei Cloud",
        "product": "CodeArts Snap",
        "name": "智能开发助手席位",
        "sectors": ["coding", "cloud"],
        "currency": "CNY",
        "monthlyPrice": 80,
        "seat": True,
        "usageLabel": "智能代码生成、单元测试生成与代码解释，深度集成华为云 DevSecOps 流水线",
        "sourceIds": ["huawei-codearts-snap"],
        "reason": "基于华为盘古研发大模型构建，集成于华为云 CodeArts 软件开发生产线席位中，底层模型非 AA Top 50 通用模型。",
        "confidence": "A",
        "confidenceReason": "华为云 CodeArts 软件开发生产线订购中心与控制台公开 Snap 助手席位增购费用。"
    },
    {
        "id": "huawei-pangu-agent-platform",
        "vendor": "Huawei Cloud",
        "product": "盘古大模型",
        "name": "政企 Agent 套件",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 2980,
        "seat": False,
        "usageLabel": "盘古行业智能体运行框架，支持矿山、政务、气象等垂直场景自动化工作流",
        "sourceIds": ["huawei-pangu-agent"],
        "reason": "面向政企垂直行业的盘古大模型智能体套件，起步月费包含行业知识库与 Agent 调度引擎，属于企业私有化/专有云方案。",
        "confidence": "A",
        "confidenceReason": "华为云大模型咨询与商业方案披露盘古行业大模型智能体基础服务支持标准。"
    },
    {
        "id": "huawei-modelarts-compute-pack",
        "vendor": "Huawei Cloud",
        "product": "ModelArts",
        "name": "昇腾算力资源包",
        "sectors": ["cloud"],
        "currency": "CNY",
        "monthlyPrice": 1980,
        "seat": False,
        "usageLabel": "Ascend 专属推理算力节点月度包，保障高吞吐与自主可控算力隔离",
        "sourceIds": ["huawei-modelarts-compute"],
        "reason": "华为云 ModelArts 专属资源池按昇腾 Ascend 算力规格包月销售，供大模型专属推理使用，非通用个人 Token 零售月包。",
        "confidence": "A",
        "confidenceReason": "华为云 ModelArts 计费中心明确列出专属算力节点包月与按需规格定价。"
    },
    # 火山引擎 / 字节跳动
    {
        "id": "bytedance-trae-marscode-enterprise",
        "vendor": "ByteDance",
        "product": "豆包代码助手 / Trae",
        "name": "企业版席位",
        "sectors": ["coding", "cloud"],
        "currency": "CNY",
        "monthlyPrice": 49,
        "seat": True,
        "usageLabel": "豆包代码大模型企业版，包含代码续写、多语言重构与团队代码规范审查",
        "sourceIds": ["bytedance-trae"],
        "reason": "国内 MarsCode 与 Trae 客户端面向个人完全免费公测；企业版按席位提供私有仓库索引与审计日志，按企业月费计价。",
        "confidence": "A",
        "confidenceReason": "火山引擎企业服务与 Trae 商业化调研显示企业版席位定价阶梯及功能规范。"
    },
    {
        "id": "coze-china-team",
        "vendor": "ByteDance",
        "product": "扣子 (Coze)",
        "name": "团队版",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 199,
        "seat": False,
        "usageLabel": "团队共享算力池与高级智能体工作流，含高并发 QPS 与专属协作空间",
        "sourceIds": ["bytedance-coze"],
        "reason": "扣子团队版按组织空间售卖，包含高并发与共享点数池，用于多成员工作流协作，非个人单模型场景。",
        "confidence": "A",
        "confidenceReason": "扣子中国版商业化定价页详细说明团队版空间月费与团队权益规格。"
    },
    {
        "id": "volcano-doubao-token-pack",
        "vendor": "ByteDance",
        "product": "火山方舟",
        "name": "豆包大模型资源包",
        "sectors": ["cloud"],
        "currency": "CNY",
        "monthlyPrice": 20,
        "seat": False,
        "usageLabel": "豆包-pro / 豆包-lite 预付费 Token 优惠包，极低单价抵扣",
        "sourceIds": ["volcano-doubao-tokens"],
        "reason": "火山方舟豆包 Pro/Lite 采用极低单价预付费资源包或按量计费，非单月固定清零订阅制。",
        "confidence": "A",
        "confidenceReason": "火山引擎火山方舟官方大模型广场明确公示豆包各规格模型预付费包折扣与单价。"
    }
]

unpaired_dict = {p["id"]: i for i, p in enumerate(catalog["unpairedPlans"])}
for p in new_unpaired:
    if p["id"] in unpaired_dict:
        catalog["unpairedPlans"][unpaired_dict[p["id"]]] = p
    else:
        catalog["unpairedPlans"].append(p)

with open(catalog_path, "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print("Added new sources, plans, and unpaired plans successfully.")
