# Requirements — [feature / change]

Copy to `docs/v-model/requirements.md`. Fill every section for **normal** and
**regulated** scale. For **tiny**, you may shorten prose but keep IDs,
acceptance criteria, and out-of-scope. Do not leave placeholder “…” rows.

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Author | … |
| Date | … |
| Scale | tiny \| normal \| regulated |
| Related tickets / links | … |
| Stakeholders | … |
| ConOps | `conops.md` (or embedded for tiny — note below) |

## 1. Context and problem

Describe the user/business problem in 1–3 paragraphs: who is affected, what
fails today, why this change matters, and any constraints (deadline, platform,
compliance). Align with `conops.md` operating context.

## 2. Goals and success metrics

| Goal | How we will know it succeeded |
| ---- | ----------------------------- |
| … | Measurable or observable outcome |

## 3. Personas / actors

| Actor | Needs from this change |
| ----- | ---------------------- |
| … | … |

## 4. Elicitation methods

Record how needs were gathered (use what applies).

| Method | Used? | Notes / artifacts |
| ------ | ----- | ----------------- |
| Interviews | [ ] | … |
| Workshops / questionnaires | [ ] | … |
| Document analysis | [ ] | … |
| Observation | [ ] | … |
| Use cases / user journeys | [ ] | … |
| Static and dynamic views with users | [ ] | … |
| Throw-away prototypes | [ ] | … |
| Other | [ ] | … |

## 5. Assumptions and dependencies

- Assumptions: …
- Upstream/downstream systems: …
- External dependencies (APIs, vendors, data): …

## 6. Functional requirements

Write testable statements. Prefer “system shall …” with clear subject. Do not
specify implementation design here.

| ID | Statement | Priority (Must/Should/Could) | Acceptance criteria (Given/When/Then or bullets) | Source |
| -- | --------- | ---------------------------- | ------------------------------------------------ | ------ |
| REQ-001 | … | Must | Given … When … Then … | ticket / user |
| REQ-002 | … | Must | … | … |

## 7. Non-functional requirements

Include at least the rows that apply; mark N/A with reason if truly irrelevant
(normal+). Regulated: expand security, audit, retention, availability.

| ID | Category | Statement | Acceptance criteria | Priority |
| -- | -------- | --------- | ------------------- | -------- |
| NFR-001 | Performance | … | e.g. p95 latency … | Must |
| NFR-002 | Security / authz | … | … | Must |
| NFR-003 | Reliability / availability | … | … | Should |
| NFR-004 | Observability | … | logs/metrics/traces … | Should |
| NFR-005 | Data / privacy | … | … | Must |
| NFR-006 | Compatibility / UX | … | browsers, locales … | Could |

## 8. Interfaces and data (requirements level)

What must be exchanged—not how it is implemented.

| Interface / data | Producer | Consumer | Mandatory fields / rules |
| ---------------- | -------- | -------- | ------------------------ |
| … | … | … | … |

## 9. Out of scope

Explicit non-goals so design does not creep.

- …
- …

## 10. Open questions and decisions needed

| ID | Question | Owner | Due | Resolution |
| -- | -------- | ----- | --- | ---------- |
| Q-001 | … | … | … | open / decided: … |

## 11. Requirements validation (left-side gate)

Validate requirements against ConOps / user needs **before** deep system design.

| Check | Status |
| ----- | ------ |
| Every Must REQ/NFR traces to ConOps goals or OS scenarios (or justified new need) | [ ] |
| Stakeholder / user review of this document completed | [ ] who/date: … |
| Feasibility issues from design fed back and requirements updated | [ ] N/A yet / done |
| Tiny-only: ConOps embedded here instead of `conops.md` | [ ] N/A / yes — rationale: … |

## 12. Change control

Requirement changes after review must be logged; update RTM the same change.

| Change ID | Date | REQ/NFR IDs affected | Summary | Approved by |
| --------- | ---- | -------------------- | ------- | ----------- |
| CHG-001 | … | … | … | … |

## 13. Paired UAT design

Create/update independent file `docs/v-model/uat.md` in this phase (business /
user-owned cases). List UAT IDs here for traceability:

| UAT ID | Covers REQ/NFR IDs | Title |
| ------ | ------------------ | ----- |
| UAT-01 | REQ-001 | … |

## 14. Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial |
