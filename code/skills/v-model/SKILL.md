---
name: v-model
description: >
  Use this skill when the user wants structured software delivery with
  requirements-driven design, early test planning, and layered
  verification/validation (unit, integration, system, UAT)—including V-model,
  SDLC gates, acceptance criteria, ConOps, requirements traceability, or
  regulated IQ/OQ/PQ qualification, even if they do not say "V-model". Do not
  use for trivial one-line fixes unless the user asks for formal process.
license: MIT
metadata:
  version: "1.4.0"
---

# V-model (software delivery)

Run a feature or change through the V-model: ConOps and requirements on the
left, implement at the bottom, verify/validate on the right. Draft each
right-side test level during its paired left-side phase—before deep coding.

```
ConOps / Requirements -------> UAT (+ PQ if regulated)
         \                      /
       System design ------> System test (+ OQ if regulated)
           \                  /
         Architecture ---> Integration
             \              /
           Module design / Unit
                 \        /
                Implement
              (+ IQ install/config if regulated)
```

**Axes:** time/completeness left→right; abstraction coarse at top. **Iterate
vertically** (up/down the V); do not silently rewrite earlier calendar history.
Software V framing (waterfall extension, pairing as minimum coverage): see
[references/concepts.md](references/concepts.md) *Software V-model*. For streams,
V&V, IQ/OQ/PQ, objectives, and limitations, read the same file.

## When to use / when not

**Use** for multi-file features, regulated or change-controlled work, or when
the user asks for acceptance criteria, traceability, ConOps, or layered tests.

**Do not use** for trivial one-line fixes, typo edits, or pure Q&A unless the
user explicitly wants formal process.

## Scale ladder

Pick a depth and say it in the first status update. When unsure, read
[references/example-walkthrough.md](references/example-walkthrough.md).

| Scale | When | Depth |
| ----- | ---- | ----- |
| Tiny | User asked for formal process on a small change | IDs, acceptance criteria, paired stubs, RTM; ConOps may embed in requirements with an omission note |
| Normal (default) | Typical feature / multi-module change | **Fill all template sections**; independent `conops.md`; no empty “…” placeholders |
| Regulated | Audit, safety, compliance, CSV/GAMP-style | All normal + full NFRs + **IQ/OQ/PQ** docs; no silent waivers |

When writing artifacts, copy the full template from `assets/` and complete it—
do not invent a one-table stub unless scale is **tiny**.

## Gotchas

- Do not defer all test writing until after coding. Pair test *design* with
  each left-side phase—later windows get squeezed when dates slip.
- "Ran the app once" is not UAT. UAT checks user needs with realistic data
  in a production-like environment.
- Do not skip stakeholder **requirements validation** against ConOps before
  descending the V.
- Do not skip a V-leg without an explicit user waiver recorded in the checklist.
- Verification ≠ validation: verification = against specs; validation = against
  user needs (see concepts.md).
- Do not merge multiple phases into one doc. Each phase owns its own file.
- Do not treat rigid 1:1 scripts as the only valid testing—pairing is the
  **minimum**; add risk-based and exploratory testing and record it.
- Do not treat a bare ID table as “done” for normal/regulated.
- This skill does **not** replace contracts or full O&M/disposal execution
  (see concepts.md limitations).

## Core rules

1. Start from ConOps (user needs + operating environment), then requirements.
   *Why:* validation needs an intended-use baseline.
2. Validate requirements on the left against ConOps via stakeholder review
   before deep design. *Why:* building the wrong spec wastes the whole V.
3. Every left-side phase produces test design for its right-side pair before
   coding deepens. *Why:* defects found late cost more.
4. Paired tests are the **minimum coverage floor**; add risk-based or
   exploratory tests beyond 1:1 links and record them. *Why:* scripts alone
   miss what is truly there.
5. Keep a bidirectional RTM: every Must REQ↔design↔tests (no orphans).
   *Why:* nothing necessary is skipped; nothing extra is unexplained.
6. Execute tests bottom-up: Unit → Integration → System → UAT; if regulated,
   IQ → OQ → PQ per concepts.md. *Why:* isolate failures lowest-first.
7. Prefer vertical iteration; log requirement changes in change control + RTM.
   *Why:* honest audit trail when design evolves.

Default artifact location: `docs/v-model/` (or a path the user names).
**One independent file per phase.** Copy templates from `assets/`:

| Phase / role | File under `docs/v-model/` | Template |
| ------------ | -------------------------- | -------- |
| Progress | `checklist.md` | [assets/checklist.md](assets/checklist.md) |
| ConOps | `conops.md` | [assets/conops.md](assets/conops.md) |
| Requirements | `requirements.md` | [assets/requirements.md](assets/requirements.md) |
| System design | `system-design.md` | [assets/system-design.md](assets/system-design.md) |
| Architecture | `architecture.md` | [assets/architecture.md](assets/architecture.md) |
| Module design | `module-design.md` (or `module-design-<name>.md`) | [assets/module-design.md](assets/module-design.md) |
| Traceability | `rtm.md` | [assets/rtm.md](assets/rtm.md) |
| Unit tests | `unit.md` | [assets/unit.md](assets/unit.md) |
| Integration tests | `integration.md` | [assets/integration.md](assets/integration.md) |
| System tests | `system.md` | [assets/system.md](assets/system.md) |
| UAT | `uat.md` | [assets/uat.md](assets/uat.md) |
| IQ (regulated) | `iq.md` | [assets/iq.md](assets/iq.md) |
| OQ (regulated) | `oq.md` | [assets/oq.md](assets/oq.md) |
| PQ (regulated) | `pq.md` | [assets/pq.md](assets/pq.md) |

When a left-side phase completes, its paired right-side file must already exist
as its own document (e.g. Requirements → `uat.md`, not a section inside
`requirements.md`).

## Workflow checklist

Copy [assets/checklist.md](assets/checklist.md) into the conversation or
`docs/v-model/checklist.md` and update it as you go.

Phase pairing:

| Left (definition) | Right (validation / qualification) |
| ----------------- | ---------------------------------- |
| ConOps + Requirements | UAT (+ PQ if regulated) |
| System design | System test (+ OQ if regulated) |
| Architecture | Integration test |
| Module design | Unit test |
| Implement / deploy | IQ if regulated |

Before entering or leaving a phase, read [references/phases.md](references/phases.md).

### Gate loop

Before advancing to the next phase:

1. Confirm the phase’s **own file** exists and template sections are filled for
   the chosen scale.
2. Confirm the paired right-side file exists as a separate document.
3. Confirm RTM rows updated (bidirectional) for requirements touched.
4. Note open risks or waivers.
5. If any gate fails: fix, re-check, then advance.

### Pre-implementation gate (plan → validate → execute)

Do **not** start deep coding until this passes:

1. **Plan:** ConOps (as required by scale); RTM rows; paired unit / integration /
   system / UAT designs exist as separate files.
2. **Validate:** Self-check ConOps→Module done-when in phases.md; requirements
   validation gate checked; left-side checklist boxes done (or waived).
3. **Execute:** Only then implement; run tests bottom-up (add IQ/OQ/PQ if
   regulated).

## Status template

After each phase (or on user request), post:

```markdown
## V-model status — [phase name]

- Scale: [tiny | normal | regulated]
- Done: [what completed]
- Artifacts: [paths]
- Paired tests: [designed | executed | waived]
- RTM: [updated | pending]
- Risks / waivers: [none | list]
- Next: [next phase]
```

## Adaptation

- If the user already has a process, map their artifacts onto the V pairs
  instead of duplicating docs.
- Agile-friendly: treat each increment as a mini-V; protect right-leg time;
  allow exploratory testing notes alongside scripted Must cases.
- Mitigate rigidity with vertical iteration, pairing-as-minimum (not ceiling),
  and written waivers—not by silently dropping levels.
