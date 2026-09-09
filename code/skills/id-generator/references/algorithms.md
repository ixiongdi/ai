# Algorithm catalog

Slugs match the [ixiongdi/id-generator](https://github.com/ixiongdi/id-generator)
`IdType` names. **Py** = `python scripts/idgen.py generate <slug>` is
implemented (stdlib).

Coordination: **none** = uncoordinated; **shared** = needs a cluster
counter/registry in production; **worker** = unique machine bits.

Sortable: **time** / **lex** / **mono** / **no**.

| Slug | Output | Sortable | Coord | Py |
| ---- | ------ | -------- | ----- | -- |
| `bro_id` | binary | no | none | no |
| `comb_guid` | UUID | time | none | no |
| `cos_id` | int | time | worker | no |
| `cuid_v1` | string | no | none | no |
| `cuid_v2` | string | no | none | no |
| `dts_id` | int | time | none | no |
| `elastic_flake` | string | time | worker | no |
| `flake` | int | time | worker | no |
| `flake_id` | int | time | worker | no |
| `flex_id` | int | mono | none | no |
| `js_safety_id` | 53-bit int | time | none | yes |
| `ksuid` | Base62 | time | none | yes |
| `lexical_uuid` | UUID | lex | none | no |
| `mist_id` | int | mono | shared | yes (local) |
| `nano_id` | URL-safe | no | none | yes |
| `object_id` | 24-hex | time | none | yes |
| `ordered_uuid` | UUID | time | none | no |
| `push_id` | string | time | none | no |
| `atomic_id` | int | mono | shared | no |
| `rid` | string | mono | shared | no |
| `segment_chain_id` | int | mono | shared | no |
| `sid` | string | no | none | no |
| `sharding_id` | int | time | worker | no |
| `snowflake` | 64-bit int | time | worker | yes |
| `sonyflake` | int | time | worker | yes |
| `business_id` | int | time | none | no |
| `entropy_id` | 64-bit int | time (s) | none | yes |
| `tts_id` | int | time | none | no |
| `ulid` | 26-char | lex | none | yes |
| `uuid_v1` | UUID | time | none | yes |
| `uuid_v2` | UUID | time | none | no |
| `uuid_v3` | UUID | no | none | yes (`--name`) |
| `uuid_v4` | UUID | no | none | yes |
| `uuid_v5` | UUID | no | none | yes (`--name`) |
| `uuid_v6` | UUID | time | none | yes |
| `uuid_v7` | UUID | time | none | yes |
| `uuid_v8` | UUID | time | shared | yes (local) |
| `wx_seq` | int | mono | none | no |
| `xid` | compact | time | none | yes |

## Entropy layout

64-bit: seconds since epoch `1746028800` in the high 32 bits; low 32
bits mixed entropy (perf counter, counter, node, random, SplitMix64).
Not strictly increasing within the same second.

## Snowflake layout

Twitter: 41-bit ms since 1288834974657, 10-bit worker, 12-bit sequence.
Pass `--worker` (0–1023).
