# graphify

一个 Agent Plugin：官方 [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)。

将任何代码库及其文档、SQL Schema、配置文件转化为可交互、可查询的结构化知识图谱（Knowledge Graph）。基于本地确定性 AST 解析与社区发现算法，无需外部向量数据库，输出交互式 HTML、GraphRAG JSON 及可读报告。

## 包含 Skill

- `graphify`:
  - 全流程提取当前目录或指定路径为知识图谱
  - 生成交互式图谱可视化（HTML/SVG/GraphML/Neo4j）
  - BFS / DFS 深度图谱检索与最短路径查询（`/graphify query "<question>"`）
  - 解释代码/概念节点（`/graphify explain "<Node>"`）

## 使用方式

在已添加 **ixiongdi-ai** 市场的客户端（Codex、Cursor、ChatGPT 桌面版）中：
- Codex：`codex plugin add graphify@ixiongdi-ai`
- Cursor：Customize 中安装 `ixiongdi/ai` 里的 `graphify`，或开发软链到 `~/.cursor/plugins/local/graphify`
