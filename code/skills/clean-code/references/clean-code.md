# Clean Code heuristics (1st edition lens)

Grounded in Robert C. Martin, *Clean Code* (1st ed.). Use as **checkable
heuristics**—do not paste or quote long book passages. Apply hardest in V-model
stages **7–9**; use earlier when names/boundaries poison architecture.

**Coverage vs 1st-ed TOC:** Ch1–13, Ch17, App A — in this file. Ch14 method —
below. Ch15–16 case studies — **skipped** (no book code); use “deep-read one
critical file” as review technique only.

---

## Ch1 — Attitude (review posture)

- Code is read far more than written; optimize for the next reader.
- **Boy Scout Rule:** leave the campground cleaner than you found it—plan todos
  should make touched paths clearer, not only catalog dirt.
- Bad code slows teams; flag productivity-killing mess on critical paths as
  `major`/`blocker` by blast radius.

## Ch14 — Successive refinement (how to order todos)

1. **Correctness / safety first** (wrong results, swallowed errors, data loss).
2. **Structure next** (extract, boundaries, DI, remove duplication).
3. **Names / formatting / comments last** (clarity polish).

Prefer small, sequenced todos over one “rewrite the module” explosion. When
reviewing, note “works but unclean” separately from “incorrect.”

## Ch2 — Meaningful names

- Reveal intent; pronounceable and searchable.
- Avoid noise (`data`, `info`, `manager` without meaning) and misleading names.
- Prefer domain vocabulary over encodings (Hungarian, needless prefixes).
- One word per concept; don’t reuse one word for two ideas.
- Replace magic numbers/strings with named constants where meaning matters.
- See also **N1–N7** in Ch17 table.

## Ch3 — Functions

- **Small**; do **one** thing at **one** abstraction level.
- **Step-down rule:** read top→bottom; each function introduces the next level
  of detail (newspaper / polite code).
- Few arguments (0–2 ideal); no flag args that fork behavior; avoid output
  arguments—return values instead.
- **Command-Query Separation (CQS):** commands change state; queries return
  info—don’t mix in one call.
- Prefer exceptions (or explicit result types) over error codes tangled into
  returns when the language supports them cleanly.
- **Switch / long if-else:** prefer polymorphism or tables when cases grow;
  keep switches low and isolated if unavoidable.
- **Structured programming:** single entry/exit when it aids clarity; avoid
  spaghetti `goto`-like control.
- No hidden side effects beside the name’s promise; **DRY** until duplication
  is meaningful variation.
- See also **F1–F4**, many **G\*** rows in Ch17.

## Ch4 — Comments

- Prefer code that makes comments unnecessary.
- Good: legal, “why”, warnings, amplifying intent for public APIs.
- Bad: noise, misleading, obsolete, redundant restatement, journal headers,
  commented-out code.
- See **C1–C5**.

## Ch5 — Formatting

- Vertical: related concepts close; blank lines separate ideas; dependents
  near dependees when practical.
- Horizontal: short lines; spacing shows precedence; **team rules beat**
  personal style.
- Huge files that mix many concerns → split (ties to classes/modules).

## Ch6 — Objects and data structures

- **Objects** hide data, expose behavior; **data structures** expose data,
  little behavior—pick deliberately (**data/object anti-symmetry**).
- Avoid hybrids that expose structure yet pretend encapsulation.
- **Law of Demeter:** avoid train wrecks across ownership boundaries.
- **DTO:** fine as thin data carriers; don’t let Active-Record-style bags grow
  hidden business logic without becoming real objects (or vice versa).

## Ch7 — Error handling

- Errors are first-class; empty / ignored `catch` is a smell.
- Don’t use exceptions for normal control flow.
- Enough context in errors; don’t leak sensitive internals to users.
- Consistent null / Optional policy; don’t return null from many layers ad hoc.
- Separate business logic from error-handling clutter when mixed blocks dominate.

## Ch8 — Boundaries

- Wrap third-party APIs; keep foreign types at the edge.
- Learning / exploratory tests at boundaries capture expected vendor behavior.
- Don’t pass raw vendor objects deep into domain code.
- See **Boundaries** under Systems when architecture leaks.

## Ch9 — Unit tests

- **FIRST:** Fast, Independent, Repeatable, Self-validating, Timely.
- Tests as clean as production; readable arrange/act/assert.
- One conceptual assertion per test (logical; may be multiple asserts).
- Test behavior/contracts, not private implementation trivia.
- Broken tests are not documentation—fix or delete.
- See **T1–T9**.

## Ch10 — Classes

- Small; **single responsibility**; high cohesion.
- Few instance variables when possible; methods use most of the state.
- Organize for change: isolate what varies.
- Classes/modules vs files: one clear concept per unit of organization.

## Ch11 — Systems

- Separate **construction** from **use** (wiring / DI vs business behavior).
- Scale by modularizing; don’t let “main” become a junk drawer.
- Decision points and cross-cutting concerns (logging, transactions) stay
  policy-pluggable where the codebase already aims for that—flag hard-wired
  policy in the middle of domain flows.

## Ch12 — Emergence (simple design)

Four rules (priority order when judging design in review):

1. Runs all the tests  
2. No duplication  
3. Expresses intent  
4. Minimizes classes/modules and methods (no speculative types)

Flag “architecture astronaut” speculative generality vs missing abstraction
on real duplication.

## Ch13 + App A — Concurrency

- Keep concurrent code separate and small; know the runtime/library model.
- Limit shared mutable state; document/sync boundaries clearly.
- Shrink critical sections; avoid holding locks while calling alien code.
- Test concurrent failures deliberately—green unit tests ≠ thread-safe.
- Flag “shotgun” synchronization and data races as `major`/`blocker` by risk.

---

## Ch17 — Smells and heuristics (checklist)

Use IDs in findings when helpful (`G5`, `N1`, …). One line each: **flag → todo**.

### Comments (C)

| ID | Flag when | Typical todo |
| -- | --------- | ------------ |
| C1 | Comment holds non-local info (change logs, owners) better in VCS | Delete; rely on git |
| C2 | Comment obsolete vs code | Update or delete |
| C3 | Comment restates code | Delete; rename if needed |
| C4 | Comment poorly written / vague | Rewrite “why” or delete |
| C5 | Commented-out code | Delete; recover from VCS if needed |

### Environment (E)

| ID | Flag when | Typical todo |
| -- | --------- | ------------ |
| E1 | Build needs many manual steps | One-command build/script |
| E2 | Tests need many manual steps | One-command test in CI |

### Functions (F)

| ID | Flag when | Typical todo |
| -- | --------- | ------------ |
| F1 | Too many arguments | Introduce arg object / split |
| F2 | Output arguments mutate inputs to “return” | Return values / new object |
| F3 | Boolean/enum flag selects behavior | Split functions |
| F4 | Dead / unused function | Delete |

### General (G)

| ID | Flag when | Typical todo |
| -- | --------- | ------------ |
| G1 | Multiple languages in one source unnecessarily | Isolate / simplify |
| G2 | Obvious behavior still fails (surprising API) | Make behavior obvious or document why |
| G3 | Incorrect behavior at boundary | Fix edge; add test |
| G4 | Overridden safety (disabled checks, ignored lint) | Re-enable or justify locally |
| G5 | Duplication | Extract shared abstraction |
| G6 | Code at wrong abstraction level | Extract / move layer |
| G7 | Base class depends on derivatives | Invert / redesign hierarchy |
| G8 | Too much info exposed | Narrow API |
| G9 | Dead code | Delete |
| G10 | Vertical separation: caller far from callee | Move closer |
| G11 | Inconsistency of similar things | Make alike things look alike |
| G12 | Clutter (noise artifacts) | Remove |
| G13 | Artificial coupling | Decouple |
| G14 | Feature envy | Move method near data |
| G15 | Argument selector / odd indexes | Named args / clearer API |
| G16 | Obscured intent | Rename / extract |
| G17 | Misplaced responsibility | Move to right module |
| G18 | Static vs non-static misuse | Prefer instance when stateful/polymorphic |
| G19 | Use explanatory variables | Introduce locals with names |
| G20 | Function names should say what they do | Rename |
| G21 | Understand the algorithm | Clarify / test / rewrite cleanly |
| G22 | Make logical dependencies physical | Explicit wiring/imports |
| G23 | Prefer polymorphism to if/switch sprawl | Polymorphic dispatch |
| G24 | Follow standard conventions (team/lang) | Align with project norms |
| G25 | Replace magic numbers with named constants | Extract constants |
| G26 | Be precise | Exact types/names/behavior |
| G27 | Structure over convention alone | Enforce in structure not lore |
| G28 | Encapsulate conditionals | Named predicates |
| G29 | Avoid negative conditionals when positive is clearer | Invert logic |
| G30 | Functions should do one thing | Extract until one thing |
| G31 | Hidden temporal coupling | Make order explicit in API/types |
| G32 | Don’t be arbitrary | Consistent structure |
| G33 | Encapsulate boundary conditions | One place owns `+1`/`−1` edges |
| G34 | Functions should descend one level | Fix abstraction roller-coaster |
| G35 | Keep configurable data high | Constants/config near root of use |
| G36 | Avoid transitive navigation (Demeter) | Hide intermediate; ask once |

### Names (N)

| ID | Flag when | Typical todo |
| -- | --------- | ------------ |
| N1 | Non-descriptive / opaque name | Rename to reveal intent |
| N2 | Name should match abstraction level | Rename / move |
| N3 | Insufficiently descriptive | Lengthen with meaning |
| N4 | Names not searchable (`i` over wide scope, cryptic abbrev) | Searchable names |
| N5 | Encoding in names (Hungarian, type prefixes) | Drop encoding |
| N6 | Name doesn’t match type/role | Rename for accuracy |
| N7 | Same concept, different names (or vice versa) | Unify vocabulary |

### Tests (T)

| ID | Flag when | Typical todo |
| -- | --------- | ------------ |
| T1 | Insufficient tests | Cover critical paths |
| T2 | Coverage tools as sole quality metric | Prefer meaningful cases |
| T3 | Trivial tests that don’t protect behavior | Replace with real cases |
| T4 | Ignored / disabled tests | Fix or delete |
| T5 | Tests not testing the right thing | Retarget assertions |
| T6 | Slow / fragile / interdependent tests | FIRST; isolate |
| T7 | Test unclear arrange/act/assert | Clean test code |
| T8 | Assertion roulette / weak asserts | Precise expectations |
| T9 | Tests require arcane setup | Simplify fixtures / builders |

### Quick smell aliases (map into G/N/F/T)

| Alias | Prefer ID | Typical todo |
| ----- | --------- | ------------ |
| Long function / deep nest | G30, G34 | Extract |
| Primitive obsession | G26 / types | Small type / value object |
| Data clumps | G13 / structs | Group fields |
| Speculative generality | Simple design #4 | Delete unused hooks |
| Divergent change / shotgun | G17, G13 | Re-boundary |
| Inappropriate intimacy | G8, G36 | Tighten API |
| Rigid statics / globals | G18, Systems DI | Inject / encapsulate |

---

## Severity hints

- **blocker:** Correctness, safety, data loss, or severe concurrency hazard.
- **major:** Recurring Ch17 hits on critical path; missing tests where logic is
  dense; broken boundaries.
- **minor:** Local clarity (names/format) with limited blast radius.
- **note:** Optional polish.

## Chapter skip note

- **Ch15–16:** Do not reproduce book case studies. Optionally deep-read one
  production file the way those chapters demonstrate successive cleaning—then
  emit concrete todos for *this* repo only.
