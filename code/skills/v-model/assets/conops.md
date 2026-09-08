# Concept of Operations (ConOps) — [feature / change]

Copy to `docs/v-model/conops.md`. Describes **user needs and the operating
environment**—what success looks like in real use—before or with detailed
requirements. Required for **normal** and **regulated**. For **tiny**, you may
embed a short ConOps subsection in `requirements.md` and note the omission here
was intentional.

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Author | … |
| Date | … |
| Scale | tiny \| normal \| regulated |
| Stakeholders | … |

## 1. Mission and goals

What outcome the system/change must enable for the organization or users.

- Mission: …
- Goals: …
- Non-goals (operational): …

## 2. Users and operators

| Actor / role | Goals in this context | Skills / constraints |
| ------------ | --------------------- | -------------------- |
| … | … | … |

## 3. Operating environment

Where and under what conditions the capability runs.

- Physical / organizational context: …
- Systems of systems / adjacent tools: …
- Networks, devices, locales, accessibility: …
- Peak vs normal load expectations: …
- Security / compliance environment: …

## 4. Operational scenarios

Primary real-world stories (not UI wireframes). Include at least one failure or
degraded mode for normal+.

### OS-01 — [name]

1. …
2. …
3. …

### OS-02 — [name]

1. …

### OS-03 — Degraded / exception — [name]

1. …

## 5. Constraints and policies

- Policy / regulatory constraints: …
- Organizational constraints: …
- Technical constraints known a priori: …

## 6. Success criteria (operational)

| Criterion | How observed in operations |
| --------- | -------------------------- |
| … | … |

## 7. Links to requirements

Fill after `requirements.md` exists (bidirectional).

| ConOps element (section / OS-id) | REQ / NFR IDs |
| -------------------------------- | ------------- |
| OS-01 | REQ-001 |
| Goals / success criteria | … |

## 8. Review

| Item | Status |
| ---- | ------ |
| Reviewed with users / stakeholders | [ ] yes — who/date: … |
| Conflicts with known constraints resolved | [ ] yes / [ ] open: … |

## 9. Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial |
