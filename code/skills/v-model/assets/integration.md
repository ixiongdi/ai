# Integration tests — [feature / change]

Copy to `docs/v-model/integration.md`. Covers **cross-module contracts** from
`architecture.md`. Do not put pure unit or full-system UAT cases here.

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Author | … |
| Date | … |
| Architecture | `architecture.md` |
| Environment | e.g. docker-compose / staging slice |
| How to run | … |

## Design quality bar

Each case targets an interface (IF-xx) or module pair: real collaborators or
contract tests with agreed fixtures—not isolated unit mocks of the same module.

## Case index

| ID | Title | Interface / modules | Maps to | Priority | Status |
| -- | ----- | ------------------- | ------- | -------- | ------ |
| IT-01 | … | IF-01 UI→API | REQ-001 | Must | designed |

## Cases

### IT-01 — [title]

| Item | Detail |
| ---- | ------ |
| Maps to | REQ-… / IF-… |
| Modules | A ↔ B |
| Preconditions | services up; seed data … |
| Test data | payloads, headers, auth tokens |
| Steps | 1. Call … 2. Observe … |
| Expected | status, body fields, side effects in collaborator |
| Cleanup | … |
| Status | designed \| passed \| failed \| blocked \| waived |
| Evidence | … |

### IT-02 — [title]

| Item | Detail |
| ---- | ------ |
| Maps to | … |
| Modules | … |
| Preconditions | … |
| Steps | … |
| Expected | … |
| Status | designed |

## Execution summary

| Pass | Fail | Blocked | Waived | Date | Runner |
| ---- | ---- | ------- | ------ | ---- | ------ |
| … | … | … | … | … | … |

## Exploratory testing

Expected note for **normal+** (optional for tiny). Share notable findings with
the customer/stakeholder when applicable.

| Charter / focus | Timebox | Tester | Notes / bugs found |
| --------------- | ------- | ------ | ------------------ |
| … | e.g. 30m | … | … |

## Defects found

| ID | Case | Summary | Severity | Disposition |
| -- | ---- | ------- | -------- | ----------- |
| … | IT-0x | … | … | … |

## Waivers

| Case ID | Reason | Approved by | Date |
| ------- | ------ | ----------- | ---- |
| … | … | … | … |

## Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial design |
