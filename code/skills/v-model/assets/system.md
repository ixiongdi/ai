# System tests — [feature / change]

Copy to `docs/v-model/system.md`. Verifies the **assembled application** against
`system-design.md` and requirements (functional + agreed NFRs): functionality,
interdependency, and communication of the whole application. Not UAT.

Plans are **composed or approved by the client / business team** (eng may draft).

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Author (drafter) | … |
| Business owner / approver | … |
| Date | … |
| System design | `system-design.md` |
| Environment | … |
| How to run | … |

## Design quality bar

Cases exercise end-to-end behavior inside the product boundary (API+UI+DB as
deployed). Map each Must REQ/NFR to at least one ST case (or waiver). Paired
cases are the **minimum**; add risk-based cases as needed.

## Subset coverage matrix

Mark each row in-scope with ST IDs, or N/A with reason.

| Subset | In scope? | ST IDs / N/A reason |
| ------ | --------- | ------------------- |
| Functional | yes / N/A | … |
| Interdependency (cross-feature within app) | yes / N/A | … |
| Communication (external systems / channels) | yes / N/A | … |
| Load | yes / N/A | … |
| Performance | yes / N/A | … |
| Stress | yes / N/A | … |
| Regression (impacted areas) | yes / N/A | … |

## Case index

| ID | Title | Type (func/NFR) | Maps to | Priority | Status |
| -- | ----- | --------------- | ------- | -------- | ------ |
| ST-01 | … | functional | REQ-001, S-01 | Must | designed |
| ST-02 | … | performance | NFR-001 | Should | designed |

## Cases

### ST-01 — [title]

| Item | Detail |
| ---- | ------ |
| Maps to | REQ-… / scenario S-… |
| Type | functional \| performance \| security \| reliability \| load \| stress \| regression \| other |
| Preconditions | env, feature flags, seed |
| Test data | … |
| Steps | 1. … 2. … |
| Expected | observable system behavior + any metrics thresholds |
| Status | designed \| passed \| failed \| blocked \| waived |
| Evidence | … |

### ST-02 — [title]

| Item | Detail |
| ---- | ------ |
| Maps to | … |
| Type | … |
| Preconditions | … |
| Steps | … |
| Expected | … |
| Status | designed |

## NFR coverage

| NFR ID | Covered by ST IDs | Gap / waiver |
| ------ | ----------------- | ------------ |
| NFR-001 | ST-02 | … |

## Exploratory testing

Expected note for **normal+** (optional for tiny). Discover beyond scripts.

| Charter / focus | Timebox | Tester | Notes / bugs found |
| --------------- | ------- | ------ | ------------------ |
| … | e.g. 30m | … | … |

## Execution summary

| Pass | Fail | Blocked | Waived | Date | Runner |
| ---- | ---- | ------- | ------ | ---- | ------ |
| … | … | … | … | … | … |

## Defects found

| ID | Case | Summary | Severity | Disposition |
| -- | ---- | ------- | -------- | ----------- |
| … | ST-0x | … | … | … |

## Waivers

| Case ID | Reason | Approved by | Date |
| ------- | ------ | ----------- | ---- |
| … | … | … | … |

## Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial design |
