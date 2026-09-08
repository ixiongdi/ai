# V-model concepts

Read this when clarifying verification vs validation, specification vs testing
streams, regulated IQ/OQ/PQ mapping, model objectives/limits, or criticism
mitigations. Procedural guidance lives in `SKILL.md` and `phases.md`.

## Software V-model

In software development the V-model is an **extension of the waterfall**: after
the coding phase the process bends upward so each definition phase has a
matching test/validation phase.

- **Horizontal axis:** time or project completeness (left → right).
- **Vertical axis:** level of abstraction (coarsest at the top).
- **Left leg:** project definition (requirements → system → architecture →
  module design).
- **Bottom:** coding / implementation.
- **Right leg:** corresponding validation (unit → integration → system → UAT).

**Pairing is the minimum coverage floor.** Derive at least the paired test
designs from each left-side artifact. Agents **may add** risk-based or
exploratory tests that are not 1:1 with a left-side section; record them in the
test file’s Exploratory section and/or RTM Notes so coverage stays auditable.

## Axes and iteration

- **Horizontal:** time / project completeness (left → right). You do not move
  backward in time; record scope changes instead of rewriting history silently.
- **Vertical:** level of abstraction (coarse at the top, detailed at the bottom).
- **Iteration:** refine up/down the V (vertical). A dual-Vee / off-core style
  means revisiting a higher or lower abstraction on the same maturity line—not
  pretending an earlier calendar phase never happened.

## Specification stream vs testing stream

Left side decomposes **what/how to build**; right side integrates and proves it.

| Specification stream | Typical content |
| -------------------- | --------------- |
| User requirements | Needs, intended use (fed by ConOps) |
| Functional / system requirements | Testable system shalls + NFRs |
| Design specifications | System, architecture, module design |

| Testing / qualification stream | Proves |
| ------------------------------ | ------ |
| Unit → Integration → System → UAT | Software default right leg |
| IQ → OQ → PQ | Regulated overlay (see below) |

Software phase pairing (always on):

| Left | Right |
| ---- | ----- |
| Requirements | UAT |
| System design | System test |
| Architecture | Integration test |
| Module design | Unit test |

## Regulated qualification mapping (IQ / OQ / PQ)

Use when scale is **regulated** or the user asks for CSV/GAMP-style
qualification. Does not replace unit/integration/system/UAT; overlays them.

| Spec focus | Software default | Regulated qualification |
| ---------- | ---------------- | ----------------------- |
| Install/config vs approved design | Deploy checklist / smoke | **IQ** — installed and configured as specified |
| Functions vs functional/design specs | System (+ integration) | **OQ** — operates correctly across specified ranges |
| Intended use / user needs / production-like use | UAT | **PQ** (+ UAT) — consistent performance in realistic use |

Typical regulated order after implementation: complete unit/integration as
usual → **IQ** (environment/build) → **OQ** (aligned with system tests) →
**PQ** / UAT (intended use). See `assets/iq.md`, `oq.md`, `pq.md`.

## Verification vs validation

- **Verification:** evaluation against a regulation, requirement, specification,
  or imposed condition—often internal. *Are we building it right?*
- **Validation:** assurance the product meets the needs of customers and other
  stakeholders—often with external acceptance. *Are we building the right thing?*

Validation is not only a right-side activity. **Validate requirements on the
left** against ConOps / user needs (stakeholder review) before descending the V.
Also validate models/designs against higher-level needs when they change.

## Traceability (bidirectional)

- Every requirement → at least one design element and one acceptance/verification
  test.
- Every design element and test → at least one requirement (no orphans).
- Maintain this in `rtm.md` and re-check at each gate.

## Objectives (why run the V)

1. **Minimize project risk** — standardized gates make deviations visible early.
2. **Improve and guarantee quality** — complete, reviewable interim results.
3. **Reduce lifecycle cost** — transparent effort; fewer late rediscoveries.
4. **Improve stakeholder communication** — shared terms and artifacts (user,
   acquirer, supplier, developer).

## Roles (lightweight)

| Role | Typical accountability |
| ---- | ---------------------- |
| User / business | Needs, ConOps input, UAT ownership, often system-test expectations |
| Acquirer | Acceptance criteria, contractual fit (contracts themselves are out of model) |
| Supplier / developer | Design, implementation, unit/integration evidence |
| Tester / QA | Verification execution; may support business-owned UAT |

## Limitations (out of this model)

The V-model as used here does **not** by itself regulate:

- Placing contracts for services
- Full organization-wide process beyond the project
- Execution of long-term operation, maintenance, repair, and disposal
  (planning/preparing a concept for those tasks *is* in scope for design docs)

Handle those with separate agreements or ops processes.

## Criticisms → mitigations

| Criticism | Mitigation in this skill |
| --------- | ------------------------ |
| Too simple / false security | Use full templates + bidirectional RTM; adapt depth by scale |
| Rigid / waterfall-like | Mini-V per increment; vertical iteration; recorded waivers |
| Rigid 1:1 leg pairing only | Treat pairing as **minimum** floor; add risk-based / exploratory beyond |
| Tests squeezed at the end | Design tests on the left; pre-implementation gate; protect right-leg time |
| Script-only testing | Scripted Must cases + exploratory charters (timebox + notes) on normal+ |
| Vague definition | Stick to software V framing, pairing table, ConOps + V&V definitions |
