# Example walkthrough (normal mini-V)

Load this when scaling depth is unclear. Shows **normal** depth with ConOps and
independent phase files. Regulated note at the end.

## Scenario

Add a “copy invite link” button on the team settings page. Link expires in
48 hours; only team admins can create links.

## Scale choice

**Normal** — full templates; independent `conops.md`; no IQ/OQ/PQ unless
upgraded to regulated.

## Files

```
docs/v-model/
  checklist.md
  conops.md
  requirements.md
  system-design.md
  architecture.md
  module-design-invite.md
  rtm.md
  unit.md
  integration.md
  system.md
  uat.md
```

## Excerpt — `conops.md`

- Mission: admins onboard members without sharing passwords.
- Environment: SaaS web app; office + remote; admin role in IdP.
- OS-01: admin copies link, sends out-of-band, invitee redeems within 48h.
- OS-02: expired link fails clearly; OS-03: non-admin cannot create links.
- Stakeholder review recorded.

## Excerpt — `requirements.md`

- Elicitation: interview + existing support tickets.
- REQ-001..003 + NFR token entropy / audit logging.
- Left-side validation against ConOps checked; change-control table ready.
- UAT-01..03 owned by business in `uat.md`.

## Excerpt — design + tests

- `system-design.md`: settings screen + Copy invite control; data dictionary
  for InviteToken; entity sketch Team 1--* InviteToken.
- `architecture.md`: tech stack + diagram; DB table overview.
- `module-design-invite.md`: typed API, field sizes, error messages, pseudocode.
- Separate `unit.md`, `integration.md`, `system.md`, `uat.md` with steps;
  system subset matrix includes functional + regression; exploratory charter
  on UAT (30m admin misuse paths).
- `rtm.md` links ConOps OS-ids → REQ → design → tests (bidirectional).

## Pre-implementation gate

Coding entry: LLD + unit designs ready; inventory green; requirements
validation gate done; then implement.

## Regulated upgrade

Add `iq.md` (build/config pins), `oq.md` (functional ranges + authz), `pq.md`
(repeatable production-like create/redeem runs) and fill RTM IQ/OQ/PQ columns;
order IQ → OQ → PQ with UAT.
