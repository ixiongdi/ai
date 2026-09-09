---
name: id-generator
description: >
  Use this skill when the user needs unique IDs, primary keys, sortable
  UUIDs, distributed IDs, Snowflake, ULID, NanoID, entropy IDs, JS-safe
  integers, or help choosing an ID algorithm in any language—even if they
  only describe PK, B-tree, cluster, or JSON Number constraints. Choose
  algorithms (entropy, UUIDv7, Snowflake, ULID, NanoId, ObjectId, JS-safe
  53-bit, MistId) and generate IDs by executing this skill's Python
  scripts. Do not use for typo-only edits, validating or parsing existing
  UUID strings, RFC 4122 history with no ID to produce, Excel/spreadsheet
  formula work, database SERIAL/autoincrement migrations, or Mongo
  connection-pooling.
license: MIT
compatibility: Requires Python 3.10+ (stdlib only)
metadata:
  version: "1.2.0"
  source: "https://github.com/ixiongdi/id-generator"
---

# ID Generator

Language-agnostic ID **algorithms**. Pick a slug, then **execute** the
Python under `scripts/` (do not reimplement generators in the chat).
When the user's project is not Python, treat `scripts/lib/generate.py`
as the spec and port that layout.

Catalog origin: [ixiongdi/id-generator](https://github.com/ixiongdi/id-generator).
`python3` preferred; `python` is fine if it is 3.10+.

## When to load references

Do not preload all of `references/`. Read a file only when needed:

- Constraints are ambiguous, or the user asks which algorithm →
  [references/decision-tree.md](references/decision-tree.md)
- Explain a non-default slug, or list the full catalog →
  [references/algorithms.md](references/algorithms.md)
- Flags beyond the examples below (`--json`, `--worker`, `--name`,
  filters) → [references/scripts.md](references/scripts.md)

## Available scripts

- **`scripts/idgen.py`** — CLI: `recommend` / `generate` / `list` /
  `explain`. Stdlib only.
- **`scripts/lib/generate.py`** — Bit layouts. Port this into
  Go/Java/TS/…; do not invent a different layout in chat.

## When to use / not

**Use** for unique IDs, PKs, Snowflake / UUID v7 / ULID / NanoID /
entropy IDs, JS-safe integers, or "which ID algorithm".

**Do not use** for typos, validating an existing UUID string, RFC
history with nothing to generate, Excel formulas, or SERIAL/autoincrement
migrations. Do not clone the Java GitHub repo just to print samples.

## Decision (defaults)

| Need | Slug |
| ---- | ---- |
| Uncoordinated 64-bit integer | `entropy_id` |
| Uncoordinated string | `uuid_v7` |
| Shared monotonic integer (Redis/DB counter) | `mist_id` |
| Shared string in a cluster | `uuid_v8` |

Overrides: JS `Number` → `js_safety_id`; URL-safe → `nano_id`;
Mongo-style → `object_id`; lex order → `ulid`; classic worker bits →
`snowflake`. Do not default to `uuid_v4` as a clustered B-tree PK.

## Execute (do not invent IDs)

From this skill directory (`SKILL.md` lives here):

```bash
python3 scripts/idgen.py recommend --output long --coordination none
python3 scripts/idgen.py generate entropy_id -n 5
python3 scripts/idgen.py generate uuid_v7 -n 5
python3 scripts/idgen.py list
python3 scripts/idgen.py explain snowflake
```

`--json` for machine-readable output. `--worker N` for Snowflake.
Coordinated slugs (`mist_id`, `uuid_v8`) emit **process-local** IDs plus
a warning: production needs a shared allocator.

Example — uncoordinated 64-bit:

```bash
python3 scripts/idgen.py recommend --output long --coordination none --json
```

```json
{"primary": "entropy_id", "reason": "…", "alternatives": ["snowflake", "js_safety_id"], "python": true}
```

If the path is unknown, locate `scripts/idgen.py` next to this
`SKILL.md`.

## Workflow

```
Progress:
- [ ] Constraints (int vs string, sortable, JS-safe, shared counter)
- [ ] recommend via scripts/idgen.py
- [ ] generate samples via scripts/idgen.py
- [ ] Port generate.py into the project language if needed
```

1. Collect constraints.
2. Run `recommend` (or use the table if already obvious).
3. Run `generate` for samples; do not hand-wave fake IDs.
4. Integrate: call the Python in a Python app, or port
   `scripts/lib/generate.py` bit layout into Go/Java/TS/etc.

## Gotchas

- **Snowflake `worker`**: two nodes with the same worker duplicate IDs.
- **JS Number**: 64-bit `entropy_id` / `snowflake` round above 2^53−1;
  use `js_safety_id` or stringify.
- **UUIDv4 PK**: random inserts fragment indexes; prefer `uuid_v7` /
  `ulid` / `entropy_id`.
- **`mist_id` / `uuid_v8`**: need a **shared** counter or node registry
  in production; the script is local-only.

## Status

```markdown
## ID status
- Constraints: [int|string], sortable=, shared_counter=, js_safe=
- Algorithm: [slug]
- Samples: [scripts/idgen.py generate …]
- Port: [python in-process | port generate.py | n/a]
- Risks: [none | worker | clock | JS precision | local mist]
```
