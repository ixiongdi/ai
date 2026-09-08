---
name: clean-code
description: >
  Review a whole codebase with Clean Code (1st ed.) heuristics ordered by the
  Wikipedia software V-model nine stages (top-to-bottom, left-to-right), then
  emit a remediation CreatePlan—do not write review docs into the target repo.
  Use when the user asks for clean-code / 代码整洁之道 / 整洁代码 review,
  V-model stage review, whole-project code review, naming/function/test smells,
  or a fix plan from requirements through UAT and coding. Do not use for
  one-line typos, pure book/history Q&A, or when the user already chose
  Bugbot/Security-only review.
license: MIT
metadata:
  version: "1.2.0"
  source: "Robert C. Martin, Clean Code (1st ed.); Wikipedia V-model (software development)"
---

# Clean Code (V-model review → plan)

Review the **target project** using **Clean Code (1st edition)** quality rules,
walking the nine Wikipedia software V-model stages **top→bottom, left→right**.
Do **not** write review reports or V-model docs into that project. Finish by
calling **CreatePlan** (plan markdown if CreatePlan is unavailable).

Heuristics gap-checked against the 1st-ed TOC (Ch1–13, Ch17, App A; Ch15–16
case code skipped). See [references/clean-code.md](references/clean-code.md).

```
Requirements ----------> UAT
      \                    /
    System design ----> System test
        \                /
      Architecture -> Integration
          \            /
        Module design / Unit
              \      /
              Coding
```

**Progressive disclosure:** load detail only when needed:

- Stage checklists → [references/stages.md](references/stages.md)
- Clean Code heuristics / Ch17 smells → [references/clean-code.md](references/clean-code.md)
- Worked example → [references/example-walkthrough.md](references/example-walkthrough.md)
- Plan skeleton → [assets/plan-template.md](assets/plan-template.md)

## When to use / not

**Use** for whole-repo or wide-scope quality review, clean-code / 代码整洁之道,
or V-shaped stage review that should end in a fix plan.

**Do not use** for trivial one-line edits, historical Q&A about the book or
model alone, or when the user already selected Bugbot / Security Review only.

## Hard rules

1. **Read-only on the target repo** during review: no Write/Edit that creates
   reports, `docs/v-model/`, or similar review artifacts there. CreatePlan is
   allowed (it is not a project doc).
2. Walk stages **strictly 1→9**. Skip nothing; missing evidence = finding, then
   continue.
3. Prefer todos that **change code or tests**. Do not demand the user author
   V-model documentation unless they ask.
4. Cite **paths** (and symbols). Never invent unread files.
5. Plan language matches the user.
6. Missing docs/tests ≠ automatic blocker—severity by risk and blast radius.
7. **Boy Scout Rule:** todos should leave touched paths cleaner than found—not
   only list dirt.
8. **Successive refinement:** order todos **correctness/safety → structure →
   names/format/comments** (see clean-code.md Ch14). No single “rewrite
   everything” todo when a sequence works.

## Workflow

Copy and track:

```
Progress:
- [ ] Scope
- [ ] Scout (read-only)
- [ ] 1 Requirements
- [ ] 2 UAT
- [ ] 3 System design
- [ ] 4 System test
- [ ] 5 Architecture
- [ ] 6 Integration test
- [ ] 7 Module design
- [ ] 8 Unit test
- [ ] 9 Coding (Clean Code + Ch17 deep pass)
- [ ] CreatePlan
```

1. **Scope** — Default: current workspace. User may narrow path / branch / PR.
2. **Scout** — Entry points, modules, README/specs, tests, CI. Sample critical
   paths; deepen where smells cluster. Read [references/stages.md](references/stages.md)
   before stage 1. Read [references/clean-code.md](references/clean-code.md)
   before stages 7–9 (and Ch8/11/12 sections if stage 5–6 already looks leaky).
3. **Stages 1→9** — Apply stage checklists; for 7–9 apply Clean Code + full
   Ch17 checklist. Cite heuristic IDs (`G5`, `N1`, …) when useful. Record
   severity + evidence.
4. **CreatePlan** — Follow [assets/plan-template.md](assets/plan-template.md):
   short verdict, `## 1`…`## 9`, todos ordered by successive refinement + Boy
   Scout impact.

Severity: `blocker` | `major` | `minor` | `note`.

## Stage order (summary)

| # | Stage | Side | Paired with |
| - | ----- | ---- | ----------- |
| 1 | Requirements analysis | Left | 2 UAT |
| 2 | User acceptance testing | Right | 1 |
| 3 | System design | Left | 4 System test |
| 4 | System testing | Right | 3 |
| 5 | Architecture (HLD) | Left | 6 Integration |
| 6 | Integration testing | Right | 5 |
| 7 | Module design (LLD) | Left | 8 Unit |
| 8 | Unit testing | Right | 7 |
| 9 | Coding | Bottom | — |

At each row, note whether the **right** side actually validates the **left**.
Pairing is a **minimum**; also note risk-based / exploratory gaps.

## Gotchas

- This skill is **review → plan**, not the `v-model` delivery skill (no forcing
  `docs/v-model/*` into the target).
- Do not bike-shed style unrelated to clarity or maintainability.
- “Many tests” ≠ clean design.
- Do not paste long passages from *Clean Code*; use heuristic IDs + short flags.
- Skill-repo files under `references/` / `assets/` / `evals/` are for the
  **agent**; never copy them into the target as the review deliverable.
