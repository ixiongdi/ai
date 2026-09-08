# UAT — [feature / change]

Copy to `docs/v-model/uat.md`. Validates **user needs** in a production-like
environment with realistic data. Design during requirements analysis; execute
last. Not a substitute for unit/integration/system verification.

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Author | … |
| Business owner / approver | … |
| Date | … |
| Requirements | `requirements.md` |
| Environment | staging / UAT env URL |
| Data set | anonymized prod-like / synthetic (describe) |

## Design quality bar

Cases are written in business language. Include happy path, critical negatives,
and authz boundaries. “Opened the app once” is not a UAT case.

## Case index

| ID | Title | Actor | Maps to | Priority | Status |
| -- | ----- | ----- | ------- | -------- | ------ |
| UAT-01 | … | Admin | REQ-001 | Must | designed |

## Cases

### UAT-01 — [title]

| Item | Detail |
| ---- | ------ |
| Maps to | REQ-001 |
| Actor / role | … |
| Preconditions | user account, prior state |
| Test data | realistic business data (describe) |
| Steps | 1. As …, navigate … 2. … |
| Expected | business-observable outcome |
| Actual (on run) | … |
| Status | designed \| passed \| failed \| blocked \| waived |
| Evidence | screenshot / recording / sign-off note |
| Tester | … |
| Date run | … |

### UAT-02 — [title]

| Item | Detail |
| ---- | ------ |
| Maps to | … |
| Actor / role | … |
| Preconditions | … |
| Steps | … |
| Expected | … |
| Status | designed |

## Acceptance decision

| Decision | go \| no-go \| go-with-waivers |
| -------- | ------------------------------ |
| Ready for real-time / production use? | yes / no — evidence: … |
| Summary | … |
| Approver | … |
| Date | … |
| Outstanding risks | … |

## Exploratory testing

Expected note for **normal+** (optional for tiny). Business users may explore
beyond scripted UAT cases.

| Charter / focus | Timebox | Tester | Notes / bugs found |
| --------------- | ------- | ------ | ------------------ |
| … | e.g. 45m | … | … |

## Defects found

| ID | Case | Summary | Severity | Disposition |
| -- | ---- | ------- | -------- | ----------- |
| … | UAT-0x | … | … | fix / defer / change REQ |

## Waivers

| Case ID | Reason | Approved by | Date |
| ------- | ------ | ----------- | ---- |
| … | … | … | … |

## Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial design |
