---
name: optimize-prompt
description: >
  Use this skill when the user wants to optimize, rewrite, or sharpen a
  user-facing chat prompt for ChatGPT, Claude, Cursor, or similar—including
  优化提示词, 改写提问, prompt 太糊, "make this prompt better", or pasting
  a draft question. Diagnose gaps (goal, context, constraints, output
  format) and return one copy-paste prompt in the user's language. Do not
  use for polishing email or prose, writing fiction, editing system prompts
  or SKILL.md descriptions, or typo-only fixes.
license: MIT
metadata:
  version: "1.0.0"
---

# Optimize prompt

Rewrite **user chat prompts** (questions pasted into ChatGPT / Claude /
Cursor). Not system prompts, role cards, or `SKILL.md` descriptions.

## When to load references

Do not preload `references/`. Read a file only when needed:

- Intent is debug, generate, or plan with extra structure →
  [references/patterns.md](references/patterns.md)
- The draft is long, vague, or padded with "you are an expert" →
  [references/anti-patterns.md](references/anti-patterns.md)

## When to use / not

**Use** when the user wants a better *question to ask a model*: 优化提示词,
改写 prompt, 提问太糊, improve this prompt for ChatGPT/Claude/Cursor.

**Do not use** for email/doc polish, fiction, system prompts, Skill
descriptions, or typos only.

## Workflow

```
Progress:
- [ ] Capture the draft (paste or spoken)
- [ ] Classify: ask | generate | debug | plan
- [ ] Diagnose gaps (do not invent facts)
- [ ] Rewrite with the default structure
- [ ] Deliver: one prompt + why + optional variant
```

1. **Classify** intent: ask / generate / debug / plan. For Cursor, note
   whether they named files or a repo.
2. **Diagnose** what the model would have to guess: one-sentence goal,
   necessary context, constraints, output format, examples. Fill only
   gaps that would change the answer. Missing facts → placeholders
   (`[文件路径]`, `[期望格式]`), never fabricated details.
3. **Rewrite** with this default (do not list CRISPE/CO-STAR/etc.):

   - Goal (one sentence)
   - Context (only what is needed)
   - Constraints (must / must not)
   - Output format
   - Optional: one short example

4. **Deliver** in the user's language:

   - One copy-paste prompt (the deliverable)
   - Bullet list: what changed and why
   - Optional: one shorter **or** stricter variant, not both, not five

## Default structure (example)

Vague: `帮我优化一下代码`

Rewritten:

```
目标：给 Cursor 一条可执行的改动指令。
上下文：仓库 [路径]；先改 [文件]，不要动 [范围]。
约束：保持现有行为，除非我另说；不要大重构。
输出：说明改了什么、怎么验证。
```

## Gotchas

- Keep the user's intent and proper nouns. Placeholders, not invented
  paths, APIs, or requirements.
- Cursor prompts must name **which files to change** and **what not to
  touch**. "帮我优化代码" is not enough.
- One finished prompt by default. Do not dump five frameworks.
- Match language: Chinese draft → Chinese prompt; English → English.

## Status

```markdown
## Prompt status
- Intent: [ask|generate|debug|plan]
- Audience tool: [ChatGPT|Claude|Cursor|other]
- Gaps filled: [goal|context|constraints|format|example]
- Language: [zh|en|…]
- Variant: [none|shorter|stricter]
```
