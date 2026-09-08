# Unit tests — [feature / change]

Copy to `docs/v-model/unit.md`. This file is **only** for unit level—do not
merge other levels here. Unit Test Plans are designed during **module design**.
A unit is the smallest independently testable entity (e.g. a module function),
verified **in isolation** from the rest of the system.

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Author | … |
| Date | … |
| Module design | `module-design.md` (or list) |
| Framework / command | e.g. `npm test -- unit` |

## Design quality bar

Each case must name the symbol under test, inputs, expected result, and mapped
REQ or module behavior. Prefer Arrange–Act–Assert in Steps. Paired cases are
the **minimum**; add edge cases as needed.

## Case index

| ID | Title | Module / symbol | Maps to | Priority | Status |
| -- | ----- | --------------- | ------- | -------- | ------ |
| UT-01 | … | `InviteService.create` | REQ-001 | Must | designed |

## Cases

### UT-01 — [title]

| Item | Detail |
| ---- | ------ |
| Maps to | REQ-001 / module-design §… |
| Symbol under test | … |
| Preconditions | mocks/fakes seeded with … |
| Test data | … |
| Steps | 1. … 2. … 3. … |
| Expected | assertions / return / thrown error |
| Notes | … |
| Status | designed \| passed \| failed \| blocked \| waived |
| Evidence | log path / CI link / date |

### UT-02 — [title]

| Item | Detail |
| ---- | ------ |
| Maps to | … |
| Symbol under test | … |
| Preconditions | … |
| Test data | … |
| Steps | … |
| Expected | … |
| Status | designed |

## Execution summary

| Pass | Fail | Blocked | Waived | Date | Runner |
| ---- | ---- | ------- | ------ | ---- | ------ |
| … | … | … | … | … | … |

## Exploratory testing

Expected note for **normal+** (optional for tiny).

| Charter / focus | Timebox | Tester | Notes / bugs found |
| --------------- | ------- | ------ | ------------------ |
| … | e.g. 20m | … | … |

## Defects found

| ID | Case | Summary | Severity | Disposition |
| -- | ---- | ------- | -------- | ----------- |
| … | UT-0x | … | … | fix / defer |

## Waivers

| Case ID | Reason | Approved by | Date |
| ------- | ------ | ----------- | ---- |
| … | … | … | … |

## Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial design |
