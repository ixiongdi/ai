/** Official decision tree — same defaults as the language-agnostic skill. */
export const DECISION_TREE_MD = `# ID algorithm decision tree

Walk **top to bottom**. Stop at the first matching row unless the user
overrides.

Generate samples with the \`id_generate\` tool (or \`python scripts/idgen.py generate <slug>\` in the skill).

## 1. Coordination

**Uncoordinated** = no shared store; uniqueness from time + entropy /
random. Fine for most services.

**Coordinated** = shared monotonic allocator (Redis \`INCR\`, DB sequence,
etcd). Use when every node must share one counter. Slugs: \`mist_id\`,
\`uuid_v8\`, \`atomic_id\`. Local samples of mist/uuid_v8 are process-local
only.

## 2. Primary table

| Coordination | Output | Slug |
| ------------ | ------ | ---- |
| Uncoordinated | 64-bit int | \`entropy_id\` |
| Uncoordinated | string | \`uuid_v7\` |
| Shared counter | 64-bit int | \`mist_id\` |
| Shared node/counter | UUID string | \`uuid_v8\` |

## 3. Overrides

| Constraint | Slug |
| ---------- | ---- |
| JSON/JS \`Number\` (53-bit) | \`js_safety_id\` |
| Compact URL-safe string | \`nano_id\` |
| MongoDB-style 12-byte hex | \`object_id\` |
| Lexicographic sortable, no hyphens | \`ulid\` |
| Classic Twitter bits + worker id | \`snowflake\` |
| Time-ordered UUID | \`uuid_v7\` (or \`uuid_v6\`) |
| Deterministic from a name | \`uuid_v5\` |
| K-sortable Base62 | \`ksuid\` |

## 4. Avoid by default

- **\`uuid_v4\`**: tokens only; poor clustered PK.
- **\`uuid_v1\`**: leaks MAC/time.
- **\`uuid_v3\`**: MD5 name-based; discouraged.
- **DB autoincrement**: only if the user wants a single-node sequence.

## 5. Entropy vs Snowflake vs Mist

- **Entropy**: 32-bit seconds + 32-bit mixed entropy; no worker; **not**
  strictly monotonic in the same second.
- **Snowflake**: monotonic per worker; unique \`worker\` per process;
  clock rollback matters.
- **Mist**: increment + random; production increment must be **shared**.

## 6. Samples vs production

\`id_generate\` and the skill CLI show format. They do not assign cluster
worker IDs or a Redis counter for you.
`;
