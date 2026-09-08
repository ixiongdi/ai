# V-model stages — review checklists

Source framing: [V-model (software development)](https://en.wikipedia.org/wiki/V-model_(software_development)).
Review order: **top→bottom, left→right** (1→9). Missing evidence = finding; continue.

Clean Code detail: [clean-code.md](clean-code.md) (1st-ed heuristics). Load before
stages 7–9; load Systems/Boundaries/Emergence sections earlier if stage 5–6
already shows leaks.

## 1 — Requirements analysis (left, top)

**Purpose (Wikipedia):** Establish what the ideal system must perform—not how to
build it. User requirements cover functional, interface, performance, data,
security, etc. UAT plans are designed here.

**Ask:** Are user needs explicit and testable? Acceptance criteria present?
Implementation detail pretending to be requirements?

**Evidence:** README goals, issues/PRs, user stories, ADRs stating *need*,
OpenAPI only when it states user-facing behavior.

**Findings when:** Goals only in tribal knowledge; AC absent; “how” dominates
“what”; no linkable need for later UAT.

## 2 — User acceptance testing (right, top)

**Purpose:** UAT plans from requirements; run in a user-like environment with
realistic data; verify readiness for real use—not a casual smoke click.

**Ask:** Can a stakeholder accept the system against stated needs? Prefer
executable acceptance checks over tribal “we tried it.”

**Evidence:** Acceptance/e2e suites tagged as acceptance, manual UAT scripts,
staging checklists with realistic data.

**Findings when:** No acceptance path; UAT = “ran the app once”; no trace to
stage-1 needs; environment not production-like.

**Clean Code link:** Weak acceptance leaves “runs all the tests” (simple design
#1) hollow at the user level—note pairing gap with stage 1.

## 3 — System design (left)

**Purpose:** Realize user requirements at system level; feasibility feedback to
users; software specification (organization, menus/UI, data structures, entity
views, dictionaries); prepare system test docs.

**Ask:** Is there a coherent system shape (org, data, primary flows)? Were
infeasible needs returned to stakeholders?

**Evidence:** System diagrams, capability-oriented modules, schema overview,
main user flows in code.

**Findings when:** God-app blob; no data/UI story for user-facing work; silent
drop of infeasible requirements.

## 4 — System testing (right)

**Purpose:** Plans from system design; often business-owned; verify functional +
non-functional needs; subsets include load, performance, stress, regression.

**Ask:** Does the whole application meet the system specification?

**Evidence:** E2E/system suites, perf/load jobs, regression nets on critical
flows.

**Findings when:** Only unit tests claim “done”; NFRs never checked; critical
flows unguarded.

## 5 — Architecture / high-level design (left)

**Purpose:** Modules, brief function, interfaces, dependencies, DB tables,
architecture diagrams, technology details; design integration tests here.

**Ask:** Are boundaries, contracts, and tech choices clear and justified by need?

**Evidence:** Package/module graph, interface packages, dependency rules,
structure-as-architecture.

**Findings when:** Cycles; unclear owners; foreign types leaked everywhere;
boundaries routinely crossed.

**Read in clean-code.md:** Ch8 Boundaries; Ch11 Systems; Ch12 Emergence;
heuristics G8, G13, G17, G22, G36; E1 if build is multi-step chaos.

## 6 — Integration testing (right)

**Purpose:** Units coexist and communicate; plans from architecture; share
results with customer team when applicable.

**Ask:** Do real boundaries (HTTP, DB, queue, FFI, module pairs) work together?

**Evidence:** Contract/API tests, consumer tests, multi-module integration
suites—not mocks that never leave the unit.

**Findings when:** Integration claimed via unit mocks only; critical interfaces
untested.

**Read in clean-code.md:** Ch8 (learning tests at boundaries); T1/T6 if
integration suite is missing or fragile; E2 if tests need many manual steps.

## 7 — Module design / low-level design (left)

**Purpose:** Enough detail to code directly: functional logic, tables/types,
full API, dependencies, errors, complete I/O; design unit tests here.

**Ask:** Could a programmer implement from the module surface without guessing?
Apply Clean Code to the *surface* (names, API shape, errors, CQS).

**Evidence:** Public APIs, types, error paths; code clarity over stale comments.

**Findings when:** Ambiguous APIs; hidden coupling; undefined errors; leaky
abstractions; flag args / output args; DTO/Active-Record confusion.

**Read in clean-code.md:** Ch2 Names; Ch3 Functions (CQS, step-down); Ch6
Objects/DS; Ch7 Errors; Ch10 Classes; F1–F4, N1–N7, G14–G17, G23, G30.

## 8 — Unit testing (right)

**Purpose:** UTPs from module design; smallest independently existing entity
correct in isolation.

**Ask:** Are units correct alone? Are tests themselves clean (FIRST, readable,
behavior-focused)?

**Evidence:** Fast, deterministic unit suites next to logic-heavy modules.

**Findings when:** No units where logic is dense; brittle/internal-only tests;
unclean or flaky suites; assertion roulette.

**Read in clean-code.md:** Ch9 Unit tests; **T1–T9** full table; FIRST; simple
design rule #1.

## 9 — Coding (bottom)

**Purpose:** Implementation at the bottom of the V; must realize upper design
and stay maintainable.

**Ask:** Does code match intent and Clean Code heuristics? Deep-pass the Ch17
checklist; apply Boy Scout + successive refinement when proposing todos.

**Evidence:** Critical-path production files (sample systematically; deepen on
smell clusters). Optionally deep-read one file (Ch15–16 *technique*, not book
code).

**Findings when:** Any C/E/F/G/N/T hit—cite ID when useful; concrete path +
refactor direction.

**Read in clean-code.md:** Entire file, especially Ch1, Ch14, Ch17, Ch13/App A
if concurrent.

## Pairing reminder

| Left | Right |
| ---- | ----- |
| 1 Requirements | 2 UAT |
| 3 System design | 4 System test |
| 5 Architecture | 6 Integration |
| 7 Module design | 8 Unit |
| 9 Coding | (ascend tests after coding in delivery; in *review*, still score 9 on cleanliness) |
