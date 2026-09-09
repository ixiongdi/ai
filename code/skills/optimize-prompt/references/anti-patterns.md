# Anti-patterns

Read this when the draft is **long**, **vague**, or padded with
boilerplate. Cut these; do not add them.

## Over-wide

- "Help me with my project" with no goal or file.
- "Optimize the code" without which files or what "better" means.
- Asking for a full product when they wanted one function.

Fix: one goal sentence + in-scope / out-of-scope.

## Over-long

- Repeating the same constraint three ways.
- Pasting a whole spec when three facts would do.
- Nested "also also also" that buries the ask.

Fix: keep unique constraints; drop restated filler.

## Fake role

- "You are a world-class expert / 20-year veteran…"
- Threats, tipping, or "take a deep breath".

These rarely change quality on current chat models. Prefer a concrete
task and output format.

## Empty prestige

- "Be professional, comprehensive, detailed, and insightful."
- "Think step by step" with no actual steps to check.

Replace with: what to check, what format to return, what to skip.

## Invented context

- Filling in a stack, company, or API the user never named.

Use `[占位符]` and ask, or leave a clearly marked hole in the prompt.
