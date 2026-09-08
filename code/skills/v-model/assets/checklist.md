# V-model progress — [feature / change]

Copy to `docs/v-model/checklist.md`. Track gates; do not use this file as a
substitute for phase documents.

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Scale | tiny \| normal \| regulated |
| Owner | … |
| Started | … |
| Target / release | … |

## Document inventory

Each phase must have its own file (paths relative to `docs/v-model/`).

| Phase | File | Exists | Complete enough for gate |
| ----- | ---- | ------ | ------------------------ |
| ConOps | `conops.md` | [ ] | [ ] (tiny: may embed in requirements) |
| Requirements | `requirements.md` | [ ] | [ ] |
| UAT design | `uat.md` | [ ] | [ ] |
| System design | `system-design.md` | [ ] | [ ] |
| System tests | `system.md` | [ ] | [ ] |
| Architecture | `architecture.md` | [ ] | [ ] |
| Integration tests | `integration.md` | [ ] | [ ] |
| Module design | `module-design*.md` | [ ] | [ ] |
| Unit tests | `unit.md` | [ ] | [ ] |
| RTM | `rtm.md` | [ ] | [ ] |
| IQ (regulated) | `iq.md` | [ ] N/A | [ ] |
| OQ (regulated) | `oq.md` | [ ] N/A | [ ] |
| PQ (regulated) | `pq.md` | [ ] N/A | [ ] |

## Phase gates

- [ ] Concept of operations (`conops.md`, or tiny embed + note)
- [ ] Requirements analysis + left-side validation + UAT design (`requirements.md` + `uat.md`)
- [ ] System design + system test design (`system-design.md` + `system.md`)
- [ ] Architecture + integration test design (`architecture.md` + `integration.md`)
- [ ] Module design + unit test design (`module-design*.md` + `unit.md`)
- [ ] Pre-implementation gate passed (RTM + paired stubs self-checked; template sections filled for scale)
- [ ] Implementation
- [ ] Unit tests executed (`unit.md` statuses updated)
- [ ] Integration tests executed (`integration.md`)
- [ ] System tests executed (`system.md`)
- [ ] Regulated only: IQ → OQ → PQ (`iq.md` / `oq.md` / `pq.md`)
- [ ] UAT executed or waived in writing (`uat.md` + acceptance decision)
- [ ] RTM complete for in-scope Must requirements (bidirectional; no orphans)

## Quality reminders

- Normal/regulated: do not leave template sections as empty “…” placeholders.
- Tiny: document which sections were intentionally omitted and why.
- One phase → one file; never merge test levels into a single `tests.md`.
- Validate requirements against ConOps before descending the V.
- This model does not replace contracts or full O&M execution (see
  `references/concepts.md`).

## Waivers

| Level / gate | Reason | Approved by | Date |
| ------------ | ------ | ----------- | ---- |
| … | … | … | … |

## Notes / risks

- …

## Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial |
