---
name: zvec
description: >
  Zvec embedded vector database. Use when building or querying vector search,
  RAG, hybrid search, or Zvec collections. Covers in-session MCP tools and
  application code (Python / Node.js SDK). Not for workspace file search
  (zvec-grep / zg). Not the ixiongdi workflow plugin.
---

# zvec

One plugin: MCP to operate collections in this session, and this skill to write
Zvec application code. Do not copy
[zvec-agent-skills](https://github.com/zvec-ai/zvec-agent-skills) or
[zvec-mcp-server](https://github.com/zvec-ai/zvec-mcp-server) into the user's
project.

## MCP (session)

Starts official `zvec-mcp-server` with `uvx`. Needs `uv`/`uvx` on PATH, Python
3.10+.

Do not put API keys in plugin files. Embedding tools need `OPENAI_API_KEY` in
the host environment (optional `OPENAI_BASE_URL`, `OPENAI_EMBEDDING_MODEL`).

Tools: collections, document CRUD, `vector_query` / `multi_vector_query`,
indexes, `embedding_write` / `embedding_search`. Resources:
`zvec://collections`, `zvec://collection/{name}`. Data stays on the disk path
the user chooses.

## SDK (application code)

Install `pip install zvec` or `npm install @zvec/zvec`. For schema, indexes
(FLAT / HNSW / IVF), RAG chunking, and language-specific examples, read the
upstream skill at query time (do not vendor it):

https://raw.githubusercontent.com/zvec-ai/zvec-agent-skills/main/skills/zvec/SKILL.md

Load topic files under that same `skills/zvec/` tree only when needed
(`quick-start/`, `rag-system/`, `hybrid-search/`, `api-cheatsheet.md`, …).

Defaults: `create_and_open()`, cosine, FP32 dense vectors, invert index on
filter fields. Match vector dimensions to the schema. Call `optimize()` after
large batch writes.
