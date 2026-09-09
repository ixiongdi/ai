# id-generator

Language-agnostic Agent Skill for **ID algorithms** (entropy, UUID v7,
Snowflake, ULID, NanoId, ObjectId, JS-safe 53-bit, Mist, …). Python
under `scripts/` is the executable implementation and the spec to port.

Catalog aligned with
[ixiongdi/id-generator](https://github.com/ixiongdi/id-generator).

Format: [Agent Skills](https://agentskills.io/home).

## Install

Install the **ixiongdi** [Agent Plugin](https://agent-plugins.org/) (this skill + the others, and MCP):
[code/README.md](../../README.md).

Do not also symlink this skill into `~/.cursor/skills/` if the plugin is installed.
Do not write `~/.cursor/skills-cursor/`. Optional project copies:
`.cursor/skills/id-generator/`, `.claude/skills/id-generator/`,
`.codex/skills/id-generator/`.

### For agent

```
Do not clone https://github.com/ixiongdi/ai.git into the user's project.
Install Agent Plugin ixiongdi (Agent Skills + MCP only) from that repo's code/:
  Cursor / Codex / other Agent Plugins 1.0 hosts: install the plugin (Cursor local: symlink code/ to ~/.cursor/plugins/local/ixiongdi)
  Claude Code and other non-Agent-Plugins hosts: skill symlink fallback, do not /plugin install
```

### For human

See [code/README.md](../../README.md). Skill-only symlink fallback:
`curl -fsSL https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.sh | bash -s -- --skill id-generator --skip-mcp`


## Layout

| Path | Role |
| ---- | ---- |
| `SKILL.md` | Pick an algorithm; **execute** Python (any language) |
| `scripts/idgen.py` | CLI: recommend / generate / list / explain |
| `scripts/lib/generate.py` | Bit layouts — port this into Go/Java/TS/… |
| `references/` | Decision tree, catalog, CLI flags (load when needed) |
| `evals/` | Output-quality cases and description triggers |
| `tests/` | Stdlib unittest for the CLI |

## Scripts

Python 3.10+, stdlib only (`compatibility` in `SKILL.md`). From this
directory (`python3` preferred):

```bash
python3 scripts/idgen.py recommend --output long --coordination none
python3 scripts/idgen.py generate uuid_v7 -n 5
python3 scripts/idgen.py list --python
```

## Skill vs MCP

| | Skill | MCP `code/mcp/id-generator` |
| - | ----- | --------------------------- |
| Job | Algorithms + Python to run or port | TypeScript stdio tools |
| Runtime | `python3 scripts/idgen.py` | Node `dist/index.js` |

Do not clone the Java repo only to print sample IDs.

## Validate

Frontmatter (spec) and CLI:

```bash
uvx --from git+https://github.com/agentskills/agentskills#subdirectory=skills-ref \
  skills-ref validate /path/to/id-generator

python3 -m unittest discover -s tests
```

`evals/trigger-*.json` and `evals/evals.json` are labeled cases for
description triggering and output quality. This repository does not run
a cross-client trigger-rate loop (that needs a live agent).

## License

MIT — see [LICENSE](LICENSE).
