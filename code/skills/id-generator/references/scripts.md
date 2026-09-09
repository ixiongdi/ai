# Python scripts

**Execute** these; do not re-code the algorithms in the model output.
Stdlib only, Python 3.10+. Run from the skill root (the folder that
contains `SKILL.md`):

```bash
python3 scripts/idgen.py <command>
```

| Command | Purpose |
| ------- | ------- |
| `recommend` | Decision tree → slug |
| `generate <slug>` | Print IDs |
| `list` | Catalog |
| `explain <slug>` | Layout and limits |

## generate

```bash
python3 scripts/idgen.py generate entropy_id
python3 scripts/idgen.py generate uuid_v7 -n 8
python3 scripts/idgen.py generate snowflake -n 3 --worker 7
python3 scripts/idgen.py generate uuid_v5 --name orders:42 --json
python3 scripts/idgen.py generate mist_id -n 2
```

- `-n/--count` 1–32 (default 1)
- `--json` object with `ids` and optional `warning`
- `--worker` Snowflake / Sonyflake (default 0)
- `--name` required for `uuid_v3` and `uuid_v5`

Bit layouts live in [scripts/lib/generate.py](../scripts/lib/generate.py).
Port that file when the app is not Python.

## recommend / list / explain

```bash
python3 scripts/idgen.py recommend --output long --coordination none
python3 scripts/idgen.py recommend --output string --js-safe --json
python3 scripts/idgen.py list --coordination none --python
python3 scripts/idgen.py explain entropy_id
```

`recommend` flags: `--output {long,string}`, `--coordination {none,shared}`,
`--js-safe`, `--url-safe`, `--mongo`, `--lexicographic`, `--snowflake`.
