import { getAlgorithm } from "./catalog.js";
import type { Algorithm } from "./types.js";

export interface ExplainDoc {
  structure: string;
  use: string;
  limitations: string;
}

const EXTRA: Record<string, ExplainDoc> = {
  entropy_id: {
    structure:
      "64-bit: seconds since epoch 1746028800 in the high 32 bits; low 32 bits are mixed entropy (hrtime, counter, node, random, SplitMix64).",
    use: "Default uncoordinated numeric PK. No workerId. High throughput.",
    limitations:
      "Not strictly monotonic within the same second. Unsafe as JavaScript Number. Collision probability is low but not a coordinated allocator.",
  },
  uuid_v7: {
    structure: "RFC 9562: 48-bit Unix ms, version 7, random bits, variant 10.",
    use: "Default uncoordinated string/UUID PK with time-ordering for indexes.",
    limitations: "128-bit storage vs 64-bit longs. Local samples illustrate format only.",
  },
  uuid_v8: {
    structure: "UUID v8 custom layout: Unix-ms prefix plus custom bits.",
    use: "Coordinated string IDs across a cluster when node/counter bits are shared.",
    limitations:
      "This MCP emits process-local samples. Production should coordinate node/counter bits.",
  },
  mist_id: {
    structure: "64-bit: increment in the high 32 bits, random in the low 32 bits.",
    use: "Official coordinated 64-bit ID when a shared increment is available.",
    limitations:
      "Local samples use a process counter only. Production must share the increment (Redis/DB).",
  },
  snowflake: {
    structure:
      "1 unused + 41-bit ms timestamp + 10-bit worker + 12-bit sequence (Twitter layout; Twitter epoch).",
    use: "When you already operate unique worker IDs per instance.",
    limitations:
      "Worker collision duplicates IDs. Clock rollback must be handled. Samples default to worker 0.",
  },
  sonyflake: {
    structure: "39-bit 10ms ticks since 2014-09-01, 8-bit sequence, 16-bit machine.",
    use: "Snowflake-family IDs with a larger machine field and coarser clock.",
    limitations: "Duplicate machine IDs duplicate sequences. Samples default to worker 0.",
  },
  js_safety_id: {
    structure: "53-bit: (millis - 1645557742) >> 4 in high bits, 16-bit random in low bits.",
    use: "IDs that will be parsed as JSON numbers in JavaScript.",
    limitations: "Shorter lifetime/space than 64-bit snowflake. Still not a shared allocator.",
  },
  uuid_v1: {
    structure: "60-bit Gregorian time, clock sequence, 48-bit node.",
    use: "Legacy time-based UUID. Prefer uuid_v7 for new work.",
    limitations: "Can leak MAC/time. Local node bytes are hashed hostname, not a real MAC.",
  },
  uuid_v3: {
    structure: "MD5 of DNS/URL namespace plus name; version 3.",
    use: "Deterministic ID from a name. Discouraged (MD5).",
    limitations: "Requires a name. Prefer uuid_v5 (SHA-1) if a named UUID is required.",
  },
  uuid_v4: {
    structure: "122 random bits, version 4.",
    use: "Opaque tokens. Avoid as default clustered B-tree PK.",
    limitations: "Random inserts fragment indexes compared with uuid_v7 / ulid / entropy_id.",
  },
  uuid_v5: {
    structure: "SHA-1 of URL namespace plus name; version 5.",
    use: "Deterministic ID from a name.",
    limitations: "Requires a name. Not time-sortable.",
  },
  uuid_v6: {
    structure: "UUID v1 timestamp reordered so the high bits sort by time.",
    use: "Time-ordered UUID compatible with v1 clocks.",
    limitations: "Still carries node/clock-seq. uuid_v7 is the usual new default.",
  },
  ulid: {
    structure: "48-bit ms time + 80-bit random, Crockford Base32, 26 characters.",
    use: "Lexicographically sortable compact string IDs.",
    limitations: "Crockford alphabet (no I,L,O,U). Local encoder is a sample.",
  },
  nano_id: {
    structure: "Default 21 chars from URL-safe alphabet (A-Za-z0-9_-).",
    use: "Short public IDs in URLs.",
    limitations: "Not time-sortable. Collision risk depends on length and volume.",
  },
  object_id: {
    structure: "12 bytes: 4-byte Unix seconds, 5-byte random, 3-byte counter; 24 hex chars.",
    use: "Mongo-style document IDs.",
    limitations: "Not a full Mongo driver ObjectId (machine/pid differ). Fine for format samples.",
  },
  ksuid: {
    structure: "20 bytes: 32-bit KSUID-epoch seconds + 16 random bytes; Base62, 27 chars.",
    use: "K-sortable opaque string IDs.",
    limitations: "Local encoder is a sample, not bit-identical to every KSUID library.",
  },
  xid: {
    structure: "12 bytes: Unix seconds + machine + pid + counter; Crockford Base32, 20 chars.",
    use: "Compact sortable globally unique IDs.",
    limitations: "Machine bytes come from a hostname hash in this MCP.",
  },
};

export function explainAlgorithm(algo: Algorithm): ExplainDoc {
  const extra = EXTRA[algo.slug];
  if (extra) {
    return extra;
  }
  return {
    structure: algo.description,
    use: `Catalog type ${algo.idType}. Output ${algo.output}, coordination ${algo.coordination}.`,
    limitations:
      algo.generateBlockReason === "shared"
        ? "Requires a shared counter (Redis/DB). Local sample generation is unsupported."
        : "This MCP does not emit local samples. Port the layout from the skill generate.py or use a library implementation.",
  };
}

export function getExplain(slug: string): { algo: Algorithm; doc: ExplainDoc } | undefined {
  const algo = getAlgorithm(slug);
  if (!algo) {
    return undefined;
  }
  return { algo, doc: explainAlgorithm(algo) };
}
