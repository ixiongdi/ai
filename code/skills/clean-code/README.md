# clean-code

Agent Skill: review a codebase with **Clean Code** heuristics, ordered by the
[Wikipedia software V-model](https://en.wikipedia.org/wiki/V-model_(software_development))
nine stages (top→bottom, left→right), then emit a **CreatePlan**—without writing
review documents into the target repository.

Format: [Agent Skills](https://agentskills.io/home)
([specification](https://agentskills.io/specification)).

## Install

Copy or symlink this directory so the folder name remains `clean-code` and
contains `SKILL.md`:

| Client | Typical path |
| ------ | ------------ |
| Cursor (personal) | `~/.cursor/skills/clean-code/` |
| Cursor (project) | `.cursor/skills/clean-code/` |
| VS Code / Copilot | `.agents/skills/clean-code/` |

```bash
ln -s /path/to/clean-code ~/.cursor/skills/clean-code
# optional (VS Code / Copilot-style paths)
ln -s /path/to/clean-code ~/.agents/skills/clean-code
```

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
