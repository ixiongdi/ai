# clean-code

Agent Skill: review a codebase with **Clean Code** heuristics, ordered by the
[Wikipedia software V-model](https://en.wikipedia.org/wiki/V-model_(software_development))
nine stages (top→bottom, left→right), then emit a **CreatePlan**—without writing
review documents into the target repository.

Format: [Agent Skills](https://agentskills.io/home)
([specification](https://agentskills.io/specification)).

## Install

Install the **ixiongdi** [Agent Plugin](https://agent-plugins.org/) (this skill + the others, and MCP):
[code/README.md](../../README.md).

Do not also symlink this skill into `~/.cursor/skills/` if the plugin is installed.
Do not write `~/.cursor/skills-cursor/`. Optional project copies:
`.cursor/skills/clean-code/`, `.claude/skills/clean-code/`,
`.codex/skills/clean-code/`.

### For agent

```
Do not clone https://github.com/ixiongdi/ai.git into the user's project.
Install Agent Plugin ixiongdi (Agent Skills + MCP only) from that repo's code/:
  Cursor / Codex / other Agent Plugins 1.0 hosts: install the plugin (Cursor local: symlink code/ to ~/.cursor/plugins/local/ixiongdi)
  Claude Code and other non-Agent-Plugins hosts: skill symlink fallback, do not /plugin install
```

### For human

See [code/README.md](../../README.md). Skill-only symlink fallback:
`curl -fsSL https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.sh | bash -s -- --skill clean-code --skip-mcp`


## Layout

| Path | Role |
| ---- | ---- |
| `SKILL.md` | Core workflow (loaded on activation) |
| `references/stages.md` | Nine V stages: purpose, evidence, findings |
| `references/clean-code.md` | Clean Code 1st-ed heuristics + Ch17 checklist |
| `references/example-walkthrough.md` | Sample review → plan |
| `assets/plan-template.md` | CreatePlan skeleton |
| `evals/` | Output-quality cases and description triggers |

## What it does

When activated, the agent should:

1. Confirm scope (default: whole workspace)
2. Scout read-only (code, tests, CI, existing specs)
3. Review stages **1→9** (pair left↔right at each row; Clean Code deep pass on 7–9)
4. Call **CreatePlan** with verdict, nine sections, prioritized fix todos
5. **Not** write review/V-model docs into the target repo

## Validate

```bash
uvx --from git+https://github.com/agentskills/agentskills#subdirectory=skills-ref \
  skills-ref validate /path/to/clean-code
```

## Evals (manual)

- `evals/evals.json` — prompts, expected behavior, assertions
- `evals/trigger-train.json` / `evals/trigger-validation.json` — description triggers

See [Evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills)
and [Optimizing skill descriptions](https://agentskills.io/skill-creation/optimizing-descriptions).

## Related

Sibling skill `v-model` drives **delivery** (write paired artifacts, then
implement). This skill only **reviews** and plans remediation.

## License

MIT — see [LICENSE](LICENSE).
