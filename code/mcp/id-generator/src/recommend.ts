import { getAlgorithm } from "./catalog.js";
import type { Algorithm, OutputKind } from "./types.js";

export interface RecommendInput {
  coordination: "none" | "shared";
  output: "long" | "string";
  js_safe?: boolean;
  url_safe?: boolean;
  mongo_style?: boolean;
  lexicographic?: boolean;
  snowflake?: boolean;
}

export interface Recommendation {
  primary: Algorithm;
  alternatives: Algorithm[];
  reason: string;
}

function must(slug: string): Algorithm {
  const a = getAlgorithm(slug);
  if (!a) {
    throw new Error(`Internal catalog missing ${slug}`);
  }
  return a;
}

export function recommend(input: RecommendInput): Recommendation {
  if (input.js_safe) {
    return {
      primary: must("js_safety_id"),
      alternatives: [must("uuid_v7")],
      reason:
        "JavaScript Number only safely represents integers up to 2^53−1. Use js_safety_id, or keep 64-bit IDs as JSON strings (uuid_v7).",
    };
  }

  if (input.mongo_style) {
    return {
      primary: must("object_id"),
      alternatives: [must("uuid_v7")],
      reason: "Mongo-style 12-byte ObjectId with timestamp prefix.",
    };
  }

  if (input.url_safe) {
    return {
      primary: must("nano_id"),
      alternatives: [must("ulid"), must("xid")],
      reason: "NanoId is compact and URL-safe. ULID/XID if you also need time order.",
    };
  }

  if (input.lexicographic && input.output === "string") {
    return {
      primary: must("ulid"),
      alternatives: [must("uuid_v7"), must("ksuid")],
      reason: "ULID is 26-char Crockford Base32 and sorts lexicographically by time.",
    };
  }

  if (input.snowflake) {
    return {
      primary: must("snowflake"),
      alternatives: [must("entropy_id"), must("mist_id")],
      reason:
        "Snowflake needs a unique worker per instance. Entropy needs none; mist needs a shared counter.",
    };
  }

  const output: OutputKind = input.output === "long" ? "long" : "string";

  if (input.coordination === "shared" && output === "long") {
    return {
      primary: must("mist_id"),
      alternatives: [must("snowflake")],
      reason:
        "Coordinated 64-bit pick is mist_id (shared increment + random). Production must share the counter.",
    };
  }

  if (input.coordination === "shared") {
    return {
      primary: must("uuid_v8"),
      alternatives: [must("uuid_v7")],
      reason:
        "Coordinated string pick is uuid_v8. uuid_v7 is the uncoordinated alternative.",
    };
  }

  if (output === "long") {
    return {
      primary: must("entropy_id"),
      alternatives: [must("snowflake"), must("js_safety_id")],
      reason:
        "Uncoordinated 64-bit pick is entropy_id. Not strictly monotonic within the same second. Unsafe as JS Number.",
    };
  }

  return {
    primary: must("uuid_v7"),
    alternatives: [must("ulid"), must("nano_id")],
    reason:
      "Uncoordinated string pick is uuid_v7. Prefer over uuid_v4 for B-tree primary keys.",
  };
}
