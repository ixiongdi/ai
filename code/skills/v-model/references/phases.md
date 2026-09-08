# V-model phases

Use this file when entering or leaving a phase, or when done-when is unclear.
Keep notes proportional to change size; for normal/regulated fill template
sections. Concepts (V&V, streams, IQ/OQ/PQ, limits): `concepts.md`.

**Each phase writes its own file** under `docs/v-model/` (paths below). Never
fold another phase’s content into the same markdown file.

## Concept of operations

**Purpose:** Capture user needs and the operating environment (intended use)
before or with detailed requirements.

**Owner:** User / business with developer facilitation.

**Docs (independent):**
- `docs/v-model/conops.md` (required normal+; tiny may embed in requirements)

**Outputs:**
- Mission/goals, actors, environment, operational scenarios, success criteria

**Done-when:**
- [ ] `conops.md` exists with scenarios and environment (or tiny embed + note)
- [ ] Stakeholder review recorded (normal+)
- [ ] Ready to derive testable requirements

## Requirements analysis

**Purpose:** Capture what the system must do for users—not how to build it.
Validate requirements against ConOps on the **left** side before descending.

**Owner:** Business analyst / product with user review; developer supports
feasibility.

**Docs (independent):**
- `docs/v-model/requirements.md`
- Paired: `docs/v-model/uat.md` (design now; execute later; **business-owned**)

**Outputs:**
- Elicitation record; functional + NFR requirements; acceptance criteria
- Stakeholder review / change-control baseline
- Draft UAT cases in `uat.md`

**Paired tests:** UAT

**Done-when:**
- [ ] `requirements.md` filled for scale (context, elicitation, REQ/NFR, validation gate)
- [ ] Each Must requirement has testable acceptance criteria
- [ ] Left-side validation against ConOps + stakeholder review complete
- [ ] `uat.md` exists with case details (steps + expected)
- [ ] `rtm.md` seeded (including ConOps links)
- [ ] Open questions captured or resolved

**Feasibility loop:** If system design finds a requirement infeasible, inform
stakeholders, update `requirements.md` (change control), and refresh UAT/RTM
before continuing.

## System design

**Purpose:** Decide how user requirements are realized at system level;
flag infeasible requirements early.

**Owner:** System / software engineers; feasibility issues returned to users.

**Docs (independent):**
- `docs/v-model/system-design.md`
- Paired: `docs/v-model/system.md` (**often business-expected**; eng may draft,
  business confirms scope)

**Outputs:**
- Software specification blueprint: system organization, UI/menus/sample
  windows (or N/A), sample reports (or N/A), entity view, data dictionary,
  scenarios, alternatives, risks
- System test plan in `system.md` (business-approved; subsets as applicable)

**Paired tests:** System test

**Done-when:**
- [ ] Feasibility issues resolved or requirements updated via change control
- [ ] `system-design.md` includes blueprint sections (UI/data dictionary or N/A)
- [ ] `system.md` detailed cases mapped to REQ/NFR; subset matrix filled
- [ ] `rtm.md` updated

## Architecture design (high-level design)

**Purpose:** Module boundaries, interfaces, dependencies, technology choices.

**Owner:** Developers / architects.

**Docs (independent):**
- `docs/v-model/architecture.md`
- Paired: `docs/v-model/integration.md`

**Outputs:**
- Modules, tech details, DB tables overview, architecture diagram (normal+),
  IF contracts, failure modes, observability
- Integration cases in `integration.md`

**Paired tests:** Integration test

**Done-when:**
- [ ] `architecture.md` names modules, tech stack, IF-xx contracts (normal+)
- [ ] Architecture diagram present for normal+
- [ ] `integration.md` has detailed cases per critical interface
- [ ] `rtm.md` updated

## Module design (low-level design)

**Purpose:** Enough detail that a programmer can code the module directly.

**Owner:** Developers.

**Docs (independent):**
- `docs/v-model/module-design.md` or `module-design-<name>.md`
- Paired: `docs/v-model/unit.md` (Unit Test Plan designed here)

**Outputs:**
- Complete API references; field types/sizes; complete I/O; error messages;
  dependencies; pseudocode as needed
- Unit cases in `unit.md`

**Paired tests:** Unit test

**Done-when:**
- [ ] API surface with typed inputs/outputs complete
- [ ] Data model includes field type and size/precision
- [ ] Error message listing and dependency list present
- [ ] Pseudocode/control flow for non-trivial logic
- [ ] `unit.md` detailed cases for those modules
- [ ] `rtm.md` updated

## Coding (bottom of the V)

**Purpose:** Implement against module design and requirements. This is the
bottom of the software V after definition phases bend upward into validation.

**Owner:** Developers (supplier).

**Entry criteria (do not start deep coding until):**
- [ ] Module design file(s) complete enough to implement without guessing
- [ ] Unit test designs exist in `unit.md` for in-scope modules
- [ ] Pre-implementation gate passed (see `SKILL.md`)

**Docs:** Update `rtm.md` code column; fill `unit.md` as tests are written.
Include in design docs a **concept** for future ops/maintenance where relevant;
full O&M execution is outside this model (`concepts.md` limitations).

**Done-when:**
- [ ] In-scope code ready for unit execution
- [ ] No silent scope creep—new needs get REQ IDs, change control, RTM rows

## Unit testing

**Purpose:** Verify the smallest independently testable entities **in isolation**
from the rest of the system (e.g. a program module or function).

**Owner:** Developers.

**Docs:** `docs/v-model/unit.md`

**Done-when:**
- [ ] Planned unit tests executed (or waived)
- [ ] Failures fixed or risk-noted
- [ ] Exploratory note present for normal+ (or tiny omission noted)
- [ ] `rtm.md` marks unit coverage

## Integration testing

**Purpose:** Verify modules coexist and communicate per architecture contracts.

**Owner:** Developers; **share results with customer/stakeholder** when applicable.

**Docs:** `docs/v-model/integration.md`

**Done-when:**
- [ ] Planned integration tests executed (or waived)
- [ ] Results shared if customer expects visibility
- [ ] `rtm.md` updated

## System testing

**Purpose:** Verify the whole application for functionality, interdependency,
and communication against system design and requirements (functional + agreed
NFRs). Subsets may include load, performance, stress, and regression.

**Owner:** Client / business team composes or approves the plan; eng executes
or supports.

**Docs:** `docs/v-model/system.md`

**Done-when:**
- [ ] Subset coverage matrix filled (in-scope or N/A+reason)
- [ ] Planned system tests executed (or waived)
- [ ] Business owner recorded on the plan
- [ ] Gaps logged; `rtm.md` updated

## Installation / Operational / Performance Qualification (regulated)

**When:** scale=regulated or explicit CSV/GAMP request. See `concepts.md` mapping.

**Order:** after unit/integration (and typically with/after deploy): **IQ → OQ → PQ**,
then or alongside UAT for intended use.

| Qual | Doc | Purpose |
| ---- | --- | ------- |
| IQ | `iq.md` | Installed/configured per approved design |
| OQ | `oq.md` | Operates per functional/design specs across ranges |
| PQ | `pq.md` | Consistent performance in realistic operational use |

**Done-when:**
- [ ] Protocols executed or waived with approver
- [ ] `rtm.md` IQ/OQ/PQ columns updated
- [ ] PQ acceptance decision recorded when required

## User acceptance testing (UAT)

**Purpose:** Validate against user needs in a production-like environment with
realistic data.

**Owner:** Business users.

**Docs:** `docs/v-model/uat.md`

**Done-when:**
- [ ] Planned UAT executed with pass/fail
- [ ] Failures dispositioned; `rtm.md` validated where applicable
- [ ] Explicit go/no-go (or waiver) including **ready for real-time / production use**
