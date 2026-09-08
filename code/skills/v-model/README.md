# v-model

Agent Skill for requirements-driven software delivery using the
[V-model](https://en.wikipedia.org/wiki/V-model) /
[software V-model](https://en.wikipedia.org/wiki/V-model_(software_development)):
ConOps, paired definition and test levels, early test planning, bidirectional
RTM, and optional regulated IQ/OQ/PQ qualification.

Format: [Agent Skills](https://agentskills.io/home)
([specification](https://agentskills.io/specification)).

## Install

Copy or symlink this directory so the folder name remains `v-model` and
contains `SKILL.md`:

| Client | Typical path |
| ------ | ------------ |
| Cursor (personal) | `~/.cursor/skills/v-model/` |
| Cursor (project) | `.cursor/skills/v-model/` |
| VS Code / Copilot | `.agents/skills/v-model/` |

Example:

```bash
ln -s /path/to/v-model ~/.cursor/skills/v-model
```

## Layout

| Path | Role |
| ---- | ---- |
| `SKILL.md` | Core workflow (loaded on activation) |
| `references/concepts.md` | V&V, streams, IQ/OQ/PQ map, objectives, limits |
| `references/phases.md` | Phase done-when, owners, regulated order |
| `references/example-walkthrough.md` | Normal mini-V example |
| `assets/` | One template per phase doc (incl. ConOps, IQ/OQ/PQ) |
| `evals/` | Output-quality cases and description trigger queries |

## What it does

When activated, the agent should:

1. Pick a scale (tiny / normal / regulated)
2. Write ConOps (or tiny embed) then requirements with left-side validation
3. Draft paired tests in **separate, complete** files during each left-side phase
4. Pass the pre-implementation gate (RTM + stubs self-checked)
5. Maintain a bidirectional RTM
6. Execute Unit → Integration → System → UAT; if regulated, IQ → OQ → PQ
7. Gate advancement with a short status update

Each phase owns an independent file under `docs/v-model/`. For **normal** and
**regulated** scale, fill all sections in the `assets/` templates.

## Validate

```bash
uvx --from git+https://github.com/agentskills/agentskills#subdirectory=skills-ref \
  skills-ref validate /path/to/v-model
```

## Evals (manual)

- `evals/evals.json` — prompts, expected behavior, and assertions
- `evals/trigger-train.json` / `evals/trigger-validation.json` — description triggers

## License

MIT — see [LICENSE](LICENSE).
