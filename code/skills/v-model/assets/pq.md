# Performance Qualification (PQ) — [feature / change]

Copy to `docs/v-model/pq.md` when scale is **regulated**. Demonstrates
**consistent performance under realistic operational conditions** for intended
use. Complements UAT (`uat.md`); PQ emphasizes repeatable production-like
performance, UAT emphasizes user acceptance of needs.

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Author | … |
| Business / quality approver | … |
| Date | … |
| ConOps / intended use | `conops.md` |
| Environment | production-like |
| Data set | describe realism |

## 1. Scope

- Intended use under test: …
- Number of runs / lots / sessions required: …
- Operators (trained as in production?): …

## 2. Case index

| ID | Title | Maps to ConOps / REQ | Priority | Status |
| -- | ----- | -------------------- | -------- | ------ |
| PQ-01 | … | OS-01 / REQ-001 | Must | designed |

## 3. Cases

### PQ-01 — [title]

| Item | Detail |
| ---- | ------ |
| Maps to | ConOps OS-… / REQ-… |
| Preconditions | IQ/OQ complete (or waived); realistic data |
| Steps | 1. … 2. … (as operators would) |
| Expected | acceptance criteria met consistently across required runs |
| Actual | … |
| Status | designed \| passed \| failed \| blocked \| waived |
| Evidence | … |

## 4. Consistency summary

| Run | Date | Result | Notes |
| --- | ---- | ------ | ----- |
| 1 | … | pass/fail | … |
| 2 | … | … | … |
| 3 | … | … | … |

## 5. Acceptance decision

| Decision | go \| no-go \| go-with-waivers |
| -------- | ------------------------------ |
| Summary | … |
| Approver | … |
| Date | … |

## 6. Waivers

| Case ID | Reason | Approved by | Date |
| ------- | ------ | ----------- | ---- |
| … | … | … | … |

## 7. Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial |
