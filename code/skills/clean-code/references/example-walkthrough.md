# Example walkthrough (review → plan)

Imaginary repo: a small HTTP API `invoice-api` with `handlers/`, `domain/`,
`db/`, few tests, README that only says “run with docker”.

## Scout

- Entry: `cmd/server/main.go`
- Logic in `handlers/invoice.go` (400+ lines), SQL strings inline
- Tests: one happy-path handler test with full HTTP stack mocked away
- No acceptance or load tests; CI = `go test ./...`

## Stage findings (abbreviated)

1. **Requirements** — major: no stated user needs/AC; billing rules only in
   handler comments (C3/C2 risk).
2. **UAT** — major: no acceptance path or staging checklist.
3. **System design** — minor: docker-compose implies shape; no clear
   capability modules beyond “handlers”.
4. **System test** — major: no e2e/NFR coverage for issue/pay flows.
5. **Architecture** — major: handlers talk to SQL directly; domain unused
   (G17 misplaced responsibility; boundary leak).
6. **Integration** — major: no DB/API contract tests (T1 at boundary).
7. **Module design** — major: `CreateInvoice` unclear; flag-like status int
   (F3); errors return bare 500.
8. **Unit** — major: money rounding/tax untested (T1); existing test slow and
   unclear (T6/T7).
9. **Coding** — major: long function (G30); duplicated tax math (G5); `_ = err`
   on payment path (error handling); names `DoIt` / `data2` (N1).

## Plan todos (successive refinement + Boy Scout)

1. **Correctness:** Replace `_ = err` on payment commit in `handlers/pay.go`;
   propagate/typed errors + test.
2. **Correctness/structure:** Extract tax/rounding to `domain` with unit tests
   (G5/G30; stages 7–9).
3. **Structure:** Add DB integration test for create/get invoice (stage 6).
4. **Structure/names:** Split `handlers/invoice.go`; rename `DoIt`/`data2` (N1).
5. **Coverage:** One acceptance scenario “issue → pay → receipt” as executable
   test (stages 1–2, 4)—prefer code over docs.

**Not** in the plan: inventing a full `docs/v-model/` tree unsolicited.
