# RTM — [feature / change]

Copy to `docs/v-model/rtm.md`. Every Must REQ/NFR needs a row. Update columns
as design, code, and tests progress. Paths refer to sibling files under
`docs/v-model/`. Bidirectional: no orphan tests or designs.

| Field | Value |
| ----- | ----- |
| Feature / change | … |
| Author | … |
| Date | … |
| Scale | tiny \| normal \| regulated |
| ConOps | `conops.md` |

## Status legend

| Status | Meaning |
| ------ | ------- |
| `open` | Requirement accepted; work not started |
| `in_progress` | Design or implementation underway |
| `verified` | Verification tests (unit/integration/system; and OQ if regulated) passed |
| `validated` | UAT (and PQ if regulated) passed for this REQ |
| `waived` | Explicit written waiver (see checklist / test file) |

## Traceability matrix

For **regulated**, fill IQ/OQ/PQ columns; otherwise use `N/A`.

| REQ/NFR ID | Priority | ConOps | System design | Architecture / IF | Module(s) | Code (path or PR) | Unit | Integration | System | UAT | IQ | OQ | PQ | Status | Notes |
| ---------- | -------- | ------ | ------------- | ----------------- | --------- | ----------------- | ---- | ----------- | ------ | --- | -- | -- | -- | ------ | ----- |
| REQ-001 | Must | OS-01 | system-design.md §8 | architecture.md IF-01 | mod-a | `path` / PR# | UT-01 | IT-01 | ST-01 | UAT-01 | N/A | N/A | N/A | open | |
| NFR-001 | Must | … | … | … | … | … | … | … | ST-0x | UAT-0x | N/A | N/A | N/A | open | |

## Coverage checklist

- [ ] Every Must REQ/NFR has a row
- [ ] Every row links to ConOps (or justified exception)
- [ ] Every row has design references (or waiver)
- [ ] Every row has unit and/or higher-level tests as appropriate for the REQ
- [ ] No orphan tests (test IDs appear in a REQ row)
- [ ] No orphan design elements introduced without a REQ/NFR
- [ ] Regulated: IQ/OQ/PQ IDs filled where applicable
- [ ] Waived items listed below with approver
- [ ] Requirement changes logged in `requirements.md` change control and reflected here

## Waivers affecting RTM

| REQ/NFR ID | Waived level | Reason | Approved by | Date |
| ---------- | ------------ | ------ | ----------- | ---- |
| … | … | … | … | … |

## Revision history

| Date | Author | Change |
| ---- | ------ | ------ |
| … | … | Initial |
