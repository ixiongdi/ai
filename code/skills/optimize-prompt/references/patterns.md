# Intent patterns

Read this when the classified intent is **debug**, **generate**, or
**plan** (or Cursor work that names a repo). Keep the default structure
in `SKILL.md`; only add the bullets that apply.

## Ask

- One question, one success criterion.
- If they want options, say how many and how to compare (e.g. 3
  approaches, trade-off table).

## Generate (text, list, code snippet in chat)

- Audience and tone (if it changes the output).
- Length or shape: bullets vs prose, approx. word/line cap.
- What **not** to invent (names, numbers, citations).

## Debug

- Expected vs actual (one sentence each).
- Minimal repro: command, input, error text.
- Environment only if it matters (OS, runtime version).
- Ask the model to locate the cause before proposing a patch.

## Plan (including Cursor)

- Outcome of the plan (what "done" looks like).
- In-scope files / areas; out-of-scope.
- Constraints: no drive-by refactors, no extra features.
- For Cursor: "edit these paths; do not edit those"; how to verify.

Do not turn a simple ask into a debug or plan prompt unless the draft
already is one.
