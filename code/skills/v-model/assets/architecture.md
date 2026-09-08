# Architecture — [feature / change]

Copy to `docs/v-model/architecture.md`. Define module boundaries and contracts.
Pair with `docs/v-model/integration.md`.

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Author | … |
| Date | … |
| Scale | tiny \| normal \| regulated |
| System design | `system-design.md` |

## 1. Architectural goals and drivers

| Driver | Implication for structure |
| ------ | ------------------------- |
| e.g. isolate billing failures | separate billing module + timeout/circuit |
| … | … |

## 2. Module / service map

| Module | Responsibility | Tech / package path | Depends on | Owned by |
| ------ | -------------- | ------------------- | ---------- | -------- |
| … | … | `path/or-service` | … | … |

Include a dependency / architecture diagram (ascii or mermaid) for **normal+**
(required, not optional).

## 3. Technology details

| Layer / concern | Choice | Version / notes |
| --------------- | ------ | --------------- |
| Language / runtime | … | … |
| Frameworks | … | … |
| Datastore | … | … |
| Messaging / jobs | … | … |
| Infra / hosting | … | … |
| Other | … | … |

## 4. Database tables overview

Mark **N/A** if no schema change.

| Table / collection | Purpose | Key columns | Owned by module |
| ------------------ | ------- | ----------- | --------------- |
| … | … | … | … |

## 5. Deployment and runtime topology

Where processes run, how they scale, sync vs async.

| Runtime unit | Hosting | Scaling | Notes |
| ------------ | ------- | ------- | ----- |
| … | … | … | … |

Async / queues / jobs (if any): …

## 6. Interface contracts

One subsection or table row per critical interface. Specify enough that
integration tests can be written without reading implementation code.

### IF-01 — [From] → [To]

| Item | Detail |
| ---- | ------ |
| Protocol | HTTP/gRPC/events/… |
| Endpoint / topic | … |
| Auth | … |
| Request | fields, types, validation rules |
| Response | success shape + codes |
| Errors | codes / body / retryability |
| Idempotency | … |
| SLAs / timeouts | … |

### IF-02 — …

## 7. Data ownership and consistency

| Data | Owner module | Readers | Consistency (strong/eventual) | Migration notes |
| ---- | ------------ | ------- | ----------------------------- | --------------- |
| … | … | … | … | … |

## 8. Security architecture

- Trust boundaries: …
- Secrets / key handling: …
- Threat notes relevant to this change: …

## 9. Observability architecture

| Signal | What / where | Alerting (if any) |
| ------ | ------------ | ----------------- |
| Logs | … | … |
| Metrics | … | … |
| Traces | … | … |

## 10. Failure modes and resilience

| Failure | Detection | Mitigation | User impact |
| ------- | --------- | ---------- | ----------- |
| … | … | … | … |

## 11. Mapping to system design / requirements

| Component (system-design) | Module(s) | REQ/NFR IDs |
| ------------------------- | --------- | ----------- |
| … | … | … |

## 12. Paired integration test design

Create/update `docs/v-model/integration.md`.

| IT ID | Interface / modules | Title |
| ----- | ------------------- | ----- |
| IT-01 | IF-01 | … |

## 13. Open architecture decisions

| ADR / decision | Status | Notes |
| -------------- | ------ | ----- |
| … | proposed / accepted | … |

## 14. Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial |
