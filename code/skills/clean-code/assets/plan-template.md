# CreatePlan template (clean-code review)

Use this structure when calling CreatePlan after stages 1–9.

```markdown
# Clean Code review plan — [project or scope]

## Overview
[1–2 sentences: overall cleanliness + V-coverage verdict]

## 1 Requirements analysis
[Conclusion.]
- `severity` · `path` · issue · fix direction

## 2 User acceptance testing
...

## 3 System design
...

## 4 System testing
...

## 5 Architecture
...

## 6 Integration testing
...

## 7 Module design
...

## 8 Unit testing
...

## 9 Coding
...

## Cross-cutting
[Optional: left↔right pairing gaps; exploratory holes; “tests squeezed late”.]
```

**Todos** (CreatePlan todos array): **successive refinement** order—
correctness/safety → structure → names/format/comments. Apply **Boy Scout**
(each todo leaves code cleaner). Map to findings; cite heuristic IDs when
useful (`G5`, `N1`, …). Favor code/test changes; include paths.

Example todo content:

- `Fix ignored error on payment commit in handlers/pay.go (correctness)`
- `Extract tax calculation from handlers/invoice.go into domain + unit tests (G5/G30)`
- `Add integration test for invoice repository against real DB testcontainer`
- `Rename DoIt/data2 in handlers/invoice.go (N1)`
