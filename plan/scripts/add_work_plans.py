import json

catalog_path = "data/catalog.json"
with open(catalog_path, "r", encoding="utf-8") as f:
    catalog = json.load(f)

# 1. New Sources for Work Plans
work_sources = [
    {
        "id": "aws-quicksight-pricing",
        "title": "Amazon QuickSight Pricing & Generative BI Author",
        "url": "https://aws.amazon.com/quicksight/pricing/",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "oracle-fusion-ai",
        "title": "Oracle Fusion Cloud Applications Generative AI Workplace",
        "url": "https://www.oracle.com/applications/",
        "type": "official_docs",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "tencent-meeting-pricing",
        "title": "腾讯会议商业版与 AI 助手订购指南",
        "url": "https://meeting.tencent.com/pricing/",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "tencent-docs-pricing",
        "title": "腾讯文档 WorkBuddy 智能办公套件计费说明",
        "url": "https://docs.qq.com/",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "baidu-wenku-ai-pricing",
        "title": "百度文库 AI 智能助手会员订购中心",
        "url": "https://wenku.baidu.com/",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "huawei-welink-pricing",
        "title": "华为云 WeLink 协同办公服务订购中心",
        "url": "https://www.huaweicloud.com/product/welink.html",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "feishu-aily-pricing",
        "title": "飞书智能伙伴与企业协同 AI 席位计费",
        "url": "https://www.feishu.cn/",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    },
    {
        "id": "microsoft-365-copilot-pricing",
        "title": "Microsoft 365 Copilot Commercial Pricing and Plans",
        "url": "https://www.microsoft.com/en-us/microsoft-365/enterprise/copilot-for-microsoft-365",
        "type": "official_pricing",
        "checkedAt": "2026-09-24"
    }
]

existing_source_ids = {s["id"] for s in catalog["sources"]}
for s in work_sources:
    if s["id"] not in existing_source_ids:
        catalog["sources"].append(s)
        existing_source_ids.add(s["id"])

# 2. New Work Plans across Top 5 Foreign + Top 5 Domestic Cloud Providers
new_work_plans = [
    # Foreign 1: AWS
    {
        "id": "aws-quicksight-q-author",
        "vendor": "AWS",
        "product": "Amazon QuickSight",
        "name": "Generative BI Q Author",
        "sectors": ["cloud"],
        "currency": "USD",
        "monthlyPrice": 24,
        "seat": True,
        "usageLabel": "企业生成式商业智能与办公数据分析，自然语言自动生成交互式仪表盘与数据故事",
        "sourceIds": ["aws-quicksight-pricing"],
        "reason": "QuickSight Q Author 为办公分析人员专属生成式 BI 席位，用于办公报表与数据叙事，非通用单个 LLM 模型固定额度订阅。",
        "confidence": "S",
        "confidenceReason": "AWS 官方 QuickSight 定价页明确列出 Generative BI Author 席位按月定价为 $24/席位/月。"
    },
    # Foreign 2: Microsoft
    {
        "id": "microsoft-365-copilot-enterprise",
        "vendor": "Microsoft",
        "product": "Microsoft 365 Copilot",
        "name": "Enterprise Add-on",
        "sectors": ["cloud", "ai"],
        "currency": "USD",
        "monthlyPrice": 30,
        "annualMonthlyPrice": 30,
        "seat": True,
        "usageLabel": "深度集成 Word, Excel (Python分析), PowerPoint, Teams, Outlook 与企业 Graph 语义检索",
        "sourceIds": ["microsoft-365-copilot-pricing", "msft-copilot-studio"],
        "reason": "Microsoft 365 Copilot 深度嵌入办公套件各组件，官方按席位年费订阅（$360/年折合 $30/月），未公开底层单模型 Token 消耗率。",
        "confidence": "S",
        "confidenceReason": "微软官方商业版授权矩阵公布 Microsoft 365 Copilot 独立商业席位价格为 $30/席位/月。"
    },
    # Foreign 3: Google
    {
        "id": "google-gemini-workspace-business",
        "vendor": "Google",
        "product": "Gemini for Google Workspace",
        "name": "Business Add-on",
        "sectors": ["cloud", "ai"],
        "currency": "USD",
        "monthlyPrice": 20,
        "annualMonthlyPrice": 20,
        "seat": True,
        "usageLabel": "Gmail, Google Docs, Sheets, Slides, Meet 深度集成 AI 办公协同与音视频会议纪要",
        "sourceIds": ["google-enterprise", "google-gemini-enterprise-app-pricing"],
        "reason": "Gemini for Workspace 面向协同办公环境提供上下文嵌入辅助，按席位月费计收，无单一模型 Token 兑换机制。",
        "confidence": "S",
        "confidenceReason": "Google Workspace 官方定价中心公布 Gemini Business 席位年付折合 $20/席位/月。"
    },
    # Foreign 4: Oracle
    {
        "id": "oracle-fusion-ai-assistant",
        "vendor": "Oracle",
        "product": "Oracle Fusion Applications",
        "name": "GenAI Workplace Assistant",
        "sectors": ["cloud"],
        "currency": "USD",
        "monthlyPrice": 40,
        "seat": True,
        "usageLabel": "内嵌于 Oracle ERP / HCM / CX 办公协同套件，支持商务公文、绩效评语与财务报表智能草拟",
        "sourceIds": ["oracle-fusion-ai", "oracle-pricing"],
        "reason": "Oracle Fusion 云原生办公 AI 内嵌于 ERP/HCM 订阅席位，按企业业务流程消费，无法换算为纯模型固定额度。",
        "confidence": "A",
        "confidenceReason": "Oracle 官方 Fusion Applications 生成式 AI 服务白皮书明确协同套件功能与席位授权标准。"
    },
    # Foreign 5: IBM
    {
        "id": "ibm-watsonx-employee-experience",
        "vendor": "IBM",
        "product": "watsonx Orchestrate",
        "name": "Employee Workplace Experience",
        "sectors": ["cloud", "ai"],
        "currency": "USD",
        "monthlyPrice": 25,
        "seat": True,
        "usageLabel": "企业数字化员工办公协同套件，提供日常 HR 自助问答、差旅费用审批与跨系统日程编排",
        "sourceIds": ["ibm-watsonx-orchestrate", "ibm-watsonx-pricing"],
        "reason": "基于 watsonx Orchestrate 运行的企业员工办公套件，按业务流与协同席位计费，未映射单个 LLM 的 token 配额。",
        "confidence": "A",
        "confidenceReason": "IBM 官方商业解决方案与 watsonx 员工协同套件披露席位起步资费标准。"
    },
    # Domestic 1: 阿里云
    {
        "id": "dingtalk-ai-workspace-pro",
        "vendor": "Alibaba Cloud",
        "product": "钉钉 (DingTalk)",
        "name": "AI 协同办公专业版",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 83.25,
        "annualMonthlyPrice": 83.25,
        "seat": False,
        "usageLabel": "包含全员钉钉文档 AI 润色排版、闪记会议智能摘要、Teambition 项目拆解与表格 AI 分析",
        "sourceIds": ["aliyun-dingtalk-ai"],
        "reason": "钉钉企业 AI 办公套件按企业租户包年售卖（999元/年起），包含组织协同、知识库与音视频会议摘要，无单独开放的 API 模型额度。",
        "confidence": "S",
        "confidenceReason": "钉钉官方商业化中心明确企业版 AI 办公套件年费 999元起，折合月费 83.25元/月。"
    },
    # Domestic 2: 腾讯云
    {
        "id": "tencent-meeting-ai-business",
        "vendor": "Tencent Cloud",
        "product": "腾讯会议 (Tencent Meeting)",
        "name": "商业版 AI 助手",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 115.84,
        "annualMonthlyPrice": 115.84,
        "seat": True,
        "usageLabel": "包含实时字幕翻译、AI 智能会议纪要、行动待办提炼、发言人观点归纳与会后自动沉淀",
        "sourceIds": ["tencent-meeting-pricing"],
        "reason": "腾讯会议商业版按账号年付/月付订阅，AI 会议助手深度整合于会议流，无单一模型输入输出 Token 核算标准。",
        "confidence": "S",
        "confidenceReason": "腾讯会议官网公布商业版年付约 115.84元/账号/月、月付 139元/月。"
    },
    {
        "id": "tencent-docs-workbuddy",
        "vendor": "Tencent Cloud",
        "product": "腾讯文档 (Tencent Docs)",
        "name": "WorkBuddy 智能办公套件",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 29,
        "seat": False,
        "usageLabel": "Word / PPT / Excel 全面 AI 智能生成、排版润色、思维导图与腾讯乐享知识库打通",
        "sourceIds": ["tencent-docs-pricing"],
        "reason": "腾讯文档 AI 办公能力集成于超级会员与 WorkBuddy 企业套件中，按月计费，模型为腾讯混元专用办公大模型。",
        "confidence": "A",
        "confidenceReason": "腾讯官方公布 WorkBuddy 企业套件统一升级及腾讯文档 AI 会员月度资费标准。"
    },
    # Domestic 3: 百度智能云
    {
        "id": "baidu-wenku-ai-vip",
        "vendor": "Baidu",
        "product": "百度文库 (Baidu Wenku)",
        "name": "AI 办公会员",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 29,
        "annualMonthlyPrice": 24.92,
        "seat": False,
        "usageLabel": "支持一键生成专业演示文稿 (PPT)、研报长文深度写作、PDF 知识点提炼与智能排版",
        "sourceIds": ["baidu-wenku-ai-pricing"],
        "reason": "百度文库 AI 会员采用会员费 + 赠送 AI 算力点数模式，主要用于职场文档与幻灯片生成，非开发者 API 模型场景。",
        "confidence": "S",
        "confidenceReason": "百度文库官方订购页明确公布 AI 会员连续包月 29元/月、年付 299元/年。"
    },
    # Domestic 4: 华为云
    {
        "id": "huawei-welink-ai-workspace",
        "vendor": "Huawei Cloud",
        "product": "华为云 WeLink",
        "name": "智能协同办公席位",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 30,
        "seat": True,
        "usageLabel": "内置盘古大模型办公能力，支持多语种同声传译、邮件自动润色起草与智能公文审核",
        "sourceIds": ["huawei-welink-pricing"],
        "reason": "华为云 WeLink 智能办公能力嵌入协同客户端席位，按人月订阅（约 30元/人/月），无法折算为单模型场景。",
        "confidence": "A",
        "confidenceReason": "华为云 WeLink 官网产品页公示政企协同办公席位基准资费方案。"
    },
    # Domestic 5: 火山引擎 / 字节跳动
    {
        "id": "feishu-aily-smart-partner",
        "vendor": "ByteDance",
        "product": "飞书 (Feishu)",
        "name": "智能伙伴 (豆包办公版)",
        "sectors": ["cloud", "ai"],
        "currency": "CNY",
        "monthlyPrice": 198,
        "annualMonthlyPrice": 165.67,
        "seat": True,
        "usageLabel": "内嵌于飞书多维表格（自动写公式/工作流）、飞书妙记（智能音视频纪要）与企业群聊知识沉淀",
        "sourceIds": ["feishu-aily-pricing"],
        "reason": "飞书智能伙伴按席位年付/月付订阅（约 198元/席/月），包含 18 万运行点数/年，用于企业知识库与多维表格自动化。",
        "confidence": "A",
        "confidenceReason": "飞书官方智能伙伴与豆包企业协同解决方案公布席位定价规格与年付优惠。"
    }
]

unpaired_dict = {p["id"]: i for i, p in enumerate(catalog["unpairedPlans"])}
for p in new_work_plans:
    if p["id"] in unpaired_dict:
        catalog["unpairedPlans"][unpaired_dict[p["id"]]] = p
    else:
        catalog["unpairedPlans"].append(p)

with open(catalog_path, "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_work_plans)} Work Plans successfully.")
