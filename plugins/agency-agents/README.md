# agency-agents

一个 Agent Plugin：收录来自 [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) 的完整 AI 专家团队架构。

收录 **18 个部门（Divisions）**、共计 **270+ 个深度定制的专家 Agent Persona**。每个 Persona 均包含专属的 Identity、Philosophy、Critical Rules、Domain Tooling 与 Deliverables 交付物规范，为 AI Agent 提供高专业度、严格守则的虚拟团队能力。

## 18 个专业部门 (Divisions)

- **Engineering (工程部)**：前端架构师、后端架构师、数据库调优师、DevOps 自动化专家、SRE、安全工程师、代码审计员等。
- **Design (设计部)**：UI 设计师、UX 研究员、设计系统架构师、Brand 视觉专家、3D/动态设计师等。
- **Product (产品部)**：技术产品经理 (TPM)、敏捷需求规划师、用户反馈综合师、行为心理机制设计等。
- **Security (安全部)**：AI 生成代码审计师、AppSec 安全工程师、云安全架构师、渗透测试专家、应急响应等。
- **Testing (测试与 QA 部)**：自动化测试工程师、API 契约测试员、无障碍可访问性审计员、性能基准压测员、真实性校验员等。
- **Marketing & Paid Media (市场与付费投放部)**：增长黑客、SEO 优化专家、转化率调优师、广告投放策略师、文案主笔等。
- **Strategy & PM (战略与项目管理部)**：项目经理、Scrum Master、商业模式分析师等。
- **Sales & Finance (销售与财务部)**：B2B 销售代表、财务建模师、定价分析师等。
- **Academic & Research (学术与研究部)**：学术论文审稿人、文献调研员、深度技术研究员等。
- **Specialized (垂直领域)**：Game Development (游戏研发)、Healthcare (医疗健康)、GIS (地理信息系统)、Spatial Computing (空间计算/VisionPro/XR)、Customer Support (技术支持) 等。

## 包含核心 Skills

- **`agency-agents`**：主路由与全局检索器。根据开发任务自动匹配并召唤对应部门的专家 Persona。
- **`agency-engineering`**：软件工程部门技能，快速召唤前后端、数据库、DevOps 与代码审查专家。
- **`agency-design`**：设计与体验部门技能，快速调取设计规范、交互动效与品牌视觉准则。
- **`agency-product`**：产品与需求部门技能，快速输出高质量 PRD、RICE 优先级与用户故事。
- **`agency-security`**：安全与风控部门技能，深度审查 AI 代码安全与架构隐患。
- **`agency-testing`**：质量与测试部门技能，生成自动化测试用例、契约测试与性能基准。

## 使用方式

在已添加 **ixiongdi-ai** 市场的客户端（Codex、Cursor、ChatGPT 桌面版）中：
- Codex：`codex plugin add agency-agents@ixiongdi-ai`
- Cursor：在 Customize 中启用 `ixiongdi/ai` 里的 `agency-agents`，或软链至 `~/.cursor/plugins/local/agency-agents`
