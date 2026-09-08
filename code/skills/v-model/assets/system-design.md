# System design — [feature / change]

Copy to `docs/v-model/system-design.md`. Explain **how** requirements are met
at system level (not module internals). Pair with `docs/v-model/system.md`.

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Author | … |
| Date | … |
| Scale | tiny \| normal \| regulated |
| Requirements doc | `requirements.md` |

## 1. Design summary

2–4 paragraphs: overall approach, major building blocks, and why this approach
was chosen over obvious alternatives.

## 2. Context and constraints

- Technical constraints (stack, hosting, existing systems): …
- Business / regulatory constraints: …
- Explicit non-goals carried from requirements: …

## 3. System context

Describe external actors and systems. Include an ascii or mermaid context
diagram for normal+.

```
[Actor] --> [This system] --> [External system]
```

| External system / actor | Interaction | Direction |
| ----------------------- | ----------- | --------- |
| … | … | in / out / both |

## 4. Logical components

| Component | Responsibility | Owns data? | Notes |
| --------- | -------------- | ---------- | ----- |
| … | … | yes/no | … |

## 5. End-to-end scenarios

Walk primary flows step-by-step (happy path + 1–2 failure paths).

### Scenario S-01 — [name]

1. …
2. …
3. …

Failure / alternate: …

### Scenario S-02 — [name]

1. …

## 6. UI / navigation blueprint

Mark **N/A** if this change has no user-facing UI.

| Item | Detail |
| ---- | ------ |
| Applicable? | yes / N/A — reason: … |
| Menus / navigation | … |
| Sample windows / screens | describe or link wireframes |
| Key user interactions | … |

## 7. Sample reports / outputs

Mark **N/A** if none.

| Report / output | Audience | Key fields | Notes |
| --------------- | -------- | ---------- | ----- |
| … | … | … | … |

## 8. Logical data model / entity view

Include an entity diagram (ascii or mermaid) for normal+ when data changes.

```
[EntityA] 1--* [EntityB]
```

| Entity | Relationship | Notes |
| ------ | ------------ | ----- |
| … | … | … |

## 9. Data dictionary (key attributes)

| Entity | Attribute | Type / meaning | Constraints | Sensitivity |
| ------ | --------- | -------------- | ----------- | ----------- |
| … | … | … | … | … |

## 10. Data at system level (stores)

| Entity / store | Purpose | Key attributes | Retention / sensitivity |
| -------------- | ------- | -------------- | ----------------------- |
| … | … | … | … |

## 11. Cross-cutting concerns

| Concern | Approach |
| ------- | -------- |
| Authn / authz | … |
| Errors / user messaging | … |
| Idempotency / retries | … |
| Auditing / logging | … |
| Config / feature flags | … |

## 12. Requirement mapping

Every Must REQ/NFR must appear.

| REQ/NFR ID | Design decision | Scenario(s) | System test IDs |
| ---------- | --------------- | ----------- | --------------- |
| REQ-001 | … | S-01 | ST-01 |
| NFR-001 | … | … | ST-0x |

## 13. Alternatives considered

| Option | Pros | Cons | Decision |
| ------ | ---- | ---- | -------- |
| A … | … | … | chosen / rejected |
| B … | … | … | … |

## 14. Risks and feasibility

| Risk | Impact | Likelihood | Mitigation | Owner |
| ---- | ------ | ---------- | ---------- | ----- |
| … | H/M/L | H/M/L | … | … |

Feasibility notes / spikes needed: …

## 15. Paired system test design

Create/update `docs/v-model/system.md`. Traceability:

| ST ID | Covers REQ/NFR / scenarios | Title |
| ----- | -------------------------- | ----- |
| ST-01 | REQ-001, S-01 | … |

## 16. Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial |
