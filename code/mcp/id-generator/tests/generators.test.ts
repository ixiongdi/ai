import assert from "node:assert/strict";
import { test } from "node:test";
import {
  generateEntropyId,
  generateJsSafetyId,
  generateKsuid,
  generateLocal,
  generateMistId,
  generateNanoId,
  generateObjectId,
  generateSnowflake,
  generateSonyflake,
  generateUlid,
  generateUuidV1,
  generateUuidV3,
  generateUuidV4,
  generateUuidV5,
  generateUuidV6,
  generateUuidV7,
  generateUuidV8,
  generateXid,
} from "../src/generators/index.js";

test("entropy_id is a positive decimal and unique in a burst", () => {
  const { ids } = generateLocal("entropy_id", 8);
  const set = new Set(ids);
  assert.equal(set.size, 8);
  for (const id of ids) {
    assert.match(id, /^[0-9]+$/);
    assert.ok(BigInt(id) > 0n);
  }
});

test("js_safety_id fits MAX_SAFE_INTEGER", () => {
  for (let i = 0; i < 20; i++) {
    const n = Number(generateJsSafetyId());
    assert.ok(Number.isSafeInteger(n));
    assert.ok(n > 0);
  }
});

test("uuid_v1 version nibble is 1", () => {
  assert.match(
    generateUuidV1(),
    /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
});

test("uuid_v3 is deterministic", () => {
  const a = generateUuidV3("https://example.com");
  const b = generateUuidV3("https://example.com");
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test("uuid_v4 format", () => {
  assert.match(
    generateUuidV4(),
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
});

test("uuid_v5 is deterministic", () => {
  const a = generateUuidV5("https://example.com");
  const b = generateUuidV5("https://example.com");
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test("uuid_v6 version nibble is 6", () => {
  assert.match(
    generateUuidV6(),
    /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
});

test("uuid_v7 version nibble is 7", () => {
  const id = generateUuidV7();
  assert.match(
    id,
    /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
});

test("uuid_v8 version nibble is 8", () => {
  const { ids, warning } = generateLocal("uuid_v8", 1);
  assert.match(
    ids[0],
    /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
  assert.match(warning ?? "", /coordinate/i);
});

test("ulid is 26 crockford chars", () => {
  const id = generateUlid();
  assert.equal(id.length, 26);
  assert.match(id, /^[0-9A-HJKMNP-TV-Z]{26}$/);
});

test("nano_id is 21 url-safe chars", () => {
  const id = generateNanoId();
  assert.equal(id.length, 21);
  assert.match(id, /^[A-Za-z0-9_-]{21}$/);
});

test("object_id is 24 hex", () => {
  assert.match(generateObjectId(), /^[0-9a-f]{24}$/);
});

test("snowflake increases for sequential calls", () => {
  const a = BigInt(generateSnowflake(0));
  const b = BigInt(generateSnowflake(0));
  assert.ok(b >= a);
});

test("sonyflake is a positive integer", () => {
  const id = BigInt(generateSonyflake(1));
  assert.ok(id > 0n);
});

test("ksuid is 27 base62 chars", () => {
  const id = generateKsuid();
  assert.equal(id.length, 27);
  assert.match(id, /^[0-9A-Za-z]{27}$/);
});

test("xid is 20 crockford chars", () => {
  const id = generateXid();
  assert.equal(id.length, 20);
  assert.match(id, /^[0-9A-HJKMNP-TV-Z]{20}$/);
});

test("mist_id is numeric and warns when generated via generateLocal", () => {
  const id = generateMistId();
  assert.match(id, /^[0-9]+$/);
  const { ids, warning } = generateLocal("mist_id", 2);
  assert.equal(ids.length, 2);
  assert.match(warning ?? "", /shared increment/i);
});

test("uuid_v3 without name throws", () => {
  assert.throws(() => generateLocal("uuid_v3", 1), /requires name/);
});

test("entropy export still works", () => {
  assert.match(generateEntropyId(), /^[0-9]+$/);
});
