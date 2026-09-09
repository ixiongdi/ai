import assert from "node:assert/strict";
import { test } from "node:test";
import { ALGORITHMS, allSlugs, filterAlgorithms, getAlgorithm, implementedSlugs } from "../src/catalog.js";

test("catalog slugs are unique", () => {
  const slugs = allSlugs();
  assert.equal(new Set(slugs).size, slugs.length);
});

test("catalog includes official defaults", () => {
  for (const slug of ["entropy_id", "uuid_v7", "mist_id", "uuid_v8", "snowflake"]) {
    assert.ok(getAlgorithm(slug), slug);
  }
});

test("shared algorithms that are not locally generated", () => {
  for (const slug of ["atomic_id", "rid", "segment_chain_id"]) {
    const a = getAlgorithm(slug);
    assert.equal(a?.coordination, "shared");
    assert.equal(a?.localGenerate, false);
    assert.equal(a?.generateBlockReason, "shared");
  }
});

test("mist_id and uuid_v8 are shared but sampleable with localOnly", () => {
  for (const slug of ["mist_id", "uuid_v8"]) {
    const a = getAlgorithm(slug);
    assert.equal(a?.coordination, "shared");
    assert.equal(a?.localGenerate, true);
    assert.equal(a?.localOnly, true);
  }
});

test("filter by coordination shared", () => {
  const shared = filterAlgorithms({ coordination: "shared" });
  assert.ok(shared.length >= 5);
  assert.ok(shared.every((a) => a.coordination === "shared"));
});

test("entropy is uncoordinated long", () => {
  const a = getAlgorithm("entropy_id");
  assert.equal(a?.output, "long");
  assert.equal(a?.coordination, "none");
  assert.equal(a?.localGenerate, true);
});

test("IdType count matches array", () => {
  assert.equal(ALGORITHMS.length, 39);
});

test("implemented slugs match the skill Python set", () => {
  const expected = [
    "entropy_id",
    "js_safety_id",
    "uuid_v1",
    "uuid_v3",
    "uuid_v4",
    "uuid_v5",
    "uuid_v6",
    "uuid_v7",
    "uuid_v8",
    "ulid",
    "nano_id",
    "object_id",
    "snowflake",
    "sonyflake",
    "mist_id",
    "ksuid",
    "xid",
  ].sort();
  assert.deepEqual([...implementedSlugs()].sort(), expected);
});
