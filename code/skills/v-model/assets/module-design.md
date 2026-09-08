# Module design — [module name]

Copy to `docs/v-model/module-design.md`, or `module-design-<name>.md` per
module. Low-level design must be detailed enough that a programmer can start
coding from this document. Pair with `docs/v-model/unit.md` (unit test plan
designed in this phase).

| Field | Value |
| ----- | ----- |
| Module | … |
| Feature / change | … |
| Author | … |
| Date | … |
| Architecture | `architecture.md` |
| Package / path | … |

## Gate note

Before coding this module: sections 2, 5–7 must be complete enough to implement
without guessing (API, field types/sizes, I/O, errors, dependencies).

## 1. Responsibility and boundaries

- In scope for this module: …
- Explicitly out of scope (belongs elsewhere): …
- Invariants the module must uphold: …

## 2. Public API / surface (complete references)

| Symbol / endpoint | Purpose | Inputs (name, type) | Outputs (name, type) | Errors |
| ----------------- | ------- | ------------------- | -------------------- | ------ |
| … | … | … | … | … |

## 3. Internal structure

| Unit (class/fn/file) | Role |
| -------------------- | ---- |
| … | … |

A **unit** is the smallest entity that can independently exist (e.g. a function
or class) and be tested in isolation.

## 4. Algorithms and control flow (pseudocode)

For non-trivial logic, describe steps or include short pseudocode.

```
function createInvite(admin, teamId):
  assert admin.hasRole(team, ADMIN)
  token = secureRandom()
  store(token, teamId, expires=now+48h)
  return url(token)
```

## 5. Data model (module-local) — types and sizes

| Entity / table / struct | Field | Type | Size / precision | Constraints / nullability | Indexes / keys |
| ----------------------- | ----- | ---- | ---------------- | ------------------------- | -------------- |
| … | … | … | … | … | … |

Validation rules: …

## 6. Complete inputs and outputs

| Flow / operation | Inputs | Outputs | Side effects |
| ---------------- | ------ | ------- | ------------ |
| … | … | … | … |

## 7. Error message listing

| Code / condition | Message (user or caller facing) | Cause | Logged? |
| ---------------- | ------------------------------ | ----- | ------- |
| … | … | … | yes/no |

## 8. Dependencies

| Dependency | Usage | Failure handling |
| ---------- | ----- | ---------------- |
| DB / client / SDK | … | … |

## 9. Edge cases and concurrency

| Case | Expected behavior |
| ---- | ----------------- |
| Duplicate request | … |
| Expired / stale state | … |
| Partial failure | … |
| Concurrent updates | … |

## 10. Configuration and feature flags

| Key | Default | Effect |
| --- | ------- | ------ |
| … | … | … |

## 11. Testability notes

How to isolate this module in unit tests (fakes, seams, pure functions): …

## 12. Requirement / design traceability

| REQ/NFR / IF ID | Implemented by (symbol) | Unit test IDs |
| --------------- | ----------------------- | ------------- |
| REQ-001 | … | UT-01 |

## 13. Paired unit test design

Create/update `docs/v-model/unit.md` (shared file listing all modules’ cases).

| UT ID | Symbol under test | Title |
| ----- | ----------------- | ----- |
| UT-01 | … | … |

## 14. Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial |
