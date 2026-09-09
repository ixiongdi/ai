import { createHash, randomBytes, randomInt, randomUUID } from "node:crypto";
import { hostname } from "node:os";

const MASK64 = 0xffffffffffffffffn;
const ENTROPY_EPOCH = 1746028800n;
const JS_EPOCH_OFFSET = 1645557742;
const TWITTER_EPOCH = 1288834974657n;
const KSUID_EPOCH = 1_400_000_000;
const SONY_EPOCH_MS = 1409529600000;
const UUID_GREGORIAN_OFFSET = 0x01b21dd213814000n;
const NAMESPACE_URL = Buffer.from("6ba7b8119dad11d180b400c04fd430c8", "hex");

let entropyCounter = 0n;
let snowflakeSeq = 0;
let snowflakeLastTs = -1n;
let sonySeq = 0;
let sonyLastTick = -1;
let objectIdCounter = randomInt(0, 0xffffff);
let mistCounter = 0;
let xidCounter = randomInt(0, 0xffffff);
const clockSeq = randomInt(0, 0x4000);

function fnv1a64(input: string): bigint {
  let hash = 0xcbf29ce484222325n;
  for (let i = 0; i < input.length; i++) {
    hash ^= BigInt(input.charCodeAt(i));
    hash = (hash * 0x100000001b3n) & MASK64;
  }
  return hash;
}

const NODE_IDENTIFIER = fnv1a64(hostname() || "id-generator-mcp");

const NODE_BYTES = Buffer.alloc(6);
{
  let tmp = NODE_IDENTIFIER;
  const src = Buffer.alloc(8);
  for (let i = 7; i >= 0; i--) {
    src[i] = Number(tmp & 0xffn);
    tmp >>= 8n;
  }
  src.subarray(2).copy(NODE_BYTES);
  NODE_BYTES[0] |= 0x01;
}

function splitMix64(entropy: bigint): bigint {
  let x = entropy & MASK64;
  x = ((x ^ (x >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK64;
  x = ((x ^ (x >> 27n)) * 0x94d049bb133111ebn) & MASK64;
  x = x ^ (x >> 31n);
  return x & MASK64;
}

function randomU64(): bigint {
  const b = randomBytes(8);
  let n = 0n;
  for (let i = 0; i < 8; i++) {
    n = (n << 8n) | BigInt(b[i]);
  }
  return n;
}

function formatUuid(bytes: Uint8Array): string {
  const hex = Buffer.from(bytes).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function uuidTime(): bigint {
  const extra = process.hrtime.bigint() % 10000n;
  return BigInt(Date.now()) * 10000n + extra + UUID_GREGORIAN_OFFSET;
}

function uuidV1Bytes(): Buffer {
  const time = uuidTime() & ((1n << 60n) - 1n);
  const out = Buffer.alloc(16);
  out.writeUInt32BE(Number(time & 0xffffffffn), 0);
  out.writeUInt16BE(Number((time >> 32n) & 0xffffn), 4);
  out.writeUInt16BE(0x1000 | Number((time >> 48n) & 0x0fffn), 6);
  out.writeUInt16BE(0x8000 | (clockSeq & 0x3fff), 8);
  NODE_BYTES.copy(out, 10);
  return out;
}

function namedUuid(name: string, version: 3 | 5): string {
  const hash = createHash(version === 3 ? "md5" : "sha1");
  hash.update(NAMESPACE_URL);
  hash.update(name);
  const digest = Uint8Array.from(hash.digest().subarray(0, 16));
  digest[6] = (digest[6] & 0x0f) | (version << 4);
  digest[8] = (digest[8] & 0x3f) | 0x80;
  return formatUuid(digest);
}

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function encodeCrockford(value: bigint, length: number): string {
  let str = "";
  let v = value;
  for (let i = 0; i < length; i++) {
    str = CROCKFORD[Number(v & 31n)] + str;
    v >>= 5n;
  }
  return str;
}

function encodeBase62(data: Buffer, length: number): string {
  let n = BigInt("0x" + data.toString("hex"));
  let str = "";
  for (let i = 0; i < length; i++) {
    const rem = Number(n % 62n);
    str = BASE62[rem] + str;
    n /= 62n;
  }
  return str;
}

/** TimeBasedEntropyId: high 32 bits seconds-since-epoch, low 32 mixed entropy. */
export function generateEntropyId(): string {
  const timestampPart =
    ((BigInt(Math.floor(Date.now() / 1000)) - ENTROPY_EPOCH) << 32n) & MASK64;
  const nano = process.hrtime.bigint();
  const counter = entropyCounter++;
  const mixed = nano ^ counter ^ NODE_IDENTIFIER ^ randomU64();
  const entropy = splitMix64(mixed) & 0xffffffffn;
  return (timestampPart | entropy).toString();
}

/** 53-bit JS-safe ID. */
export function generateJsSafetyId(): string {
  const currentTime = Date.now() - JS_EPOCH_OFFSET;
  const timestampPart = Math.floor(currentTime / 16) * 65536;
  const randomPart = randomInt(0, 0x10000);
  return String(timestampPart + randomPart);
}

export function generateUuidV1(): string {
  return formatUuid(uuidV1Bytes());
}

export function generateUuidV3(name: string): string {
  return namedUuid(name, 3);
}

export function generateUuidV4(): string {
  return randomUUID();
}

export function generateUuidV5(name: string): string {
  return namedUuid(name, 5);
}

/** RFC 9562 UUID version 6 from a v1 timestamp. */
export function generateUuidV6(): string {
  const v1 = uuidV1Bytes();
  const timeLow = v1.readUInt32BE(0);
  const timeMid = v1.readUInt16BE(4);
  const timeHi = v1.readUInt16BE(6) & 0x0fff;
  const greg =
    (BigInt(timeHi) << 48n) | (BigInt(timeMid) << 32n) | BigInt(timeLow);
  const out = Buffer.alloc(16);
  const high = Buffer.alloc(8);
  high.writeBigUInt64BE(greg >> 12n);
  high.subarray(2, 8).copy(out, 0);
  out[6] = 0x60 | Number((greg >> 8n) & 0x0fn);
  out[7] = Number(greg & 0xffn);
  v1.copy(out, 8, 8, 16);
  out[8] = (out[8] & 0x3f) | 0x80;
  return formatUuid(out);
}

/** RFC 9562 UUID version 7. */
export function generateUuidV7(): string {
  const bytes = new Uint8Array(randomBytes(16));
  const ts = BigInt(Date.now());
  bytes[0] = Number((ts >> 40n) & 0xffn);
  bytes[1] = Number((ts >> 32n) & 0xffn);
  bytes[2] = Number((ts >> 24n) & 0xffn);
  bytes[3] = Number((ts >> 16n) & 0xffn);
  bytes[4] = Number((ts >> 8n) & 0xffn);
  bytes[5] = Number(ts & 0xffn);
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
}

/** UUID v8: Unix-ms + custom bits (local node). */
export function generateUuidV8(): string {
  const bytes = new Uint8Array(randomBytes(16));
  const ts = BigInt(Date.now());
  bytes[0] = Number((ts >> 40n) & 0xffn);
  bytes[1] = Number((ts >> 32n) & 0xffn);
  bytes[2] = Number((ts >> 24n) & 0xffn);
  bytes[3] = Number((ts >> 16n) & 0xffn);
  bytes[4] = Number((ts >> 8n) & 0xffn);
  bytes[5] = Number(ts & 0xffn);
  bytes[6] = (bytes[6] & 0x0f) | 0x80;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
}

export function generateUlid(): string {
  const time = BigInt(Date.now()) & ((1n << 48n) - 1n);
  const rand = (randomU64() << 16n) | BigInt(randomInt(0, 0x10000));
  return encodeCrockford(time, 10) + encodeCrockford(rand & ((1n << 80n) - 1n), 16);
}

const NANO_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

export function generateNanoId(size = 21): string {
  const bytes = randomBytes(size);
  let id = "";
  for (let i = 0; i < size; i++) {
    id += NANO_ALPHABET[bytes[i] & 63];
  }
  return id;
}

export function generateObjectId(): string {
  const buf = Buffer.alloc(12);
  buf.writeUInt32BE(Math.floor(Date.now() / 1000), 0);
  randomBytes(5).copy(buf, 4);
  objectIdCounter = (objectIdCounter + 1) & 0xffffff;
  buf[9] = (objectIdCounter >> 16) & 0xff;
  buf[10] = (objectIdCounter >> 8) & 0xff;
  buf[11] = objectIdCounter & 0xff;
  return buf.toString("hex");
}

/** Local demo Snowflake. Duplicate workers duplicate IDs. */
export function generateSnowflake(workerId = 0): string {
  const worker = BigInt(workerId & 0x3ff);
  let ts = BigInt(Date.now());
  if (ts === snowflakeLastTs) {
    snowflakeSeq = (snowflakeSeq + 1) & 0xfff;
    if (snowflakeSeq === 0) {
      while (ts <= snowflakeLastTs) {
        ts = BigInt(Date.now());
      }
    }
  } else {
    snowflakeSeq = 0;
  }
  snowflakeLastTs = ts;
  const id =
    ((ts - TWITTER_EPOCH) << 22n) | (worker << 12n) | BigInt(snowflakeSeq);
  return id.toString();
}

/** Sonyflake: 39-bit 10ms ticks, 8-bit sequence, 16-bit machine. */
export function generateSonyflake(workerId = 0): string {
  const machine = workerId & 0xffff;
  let tick = Math.floor(Date.now() / 10);
  if (tick === sonyLastTick) {
    sonySeq = (sonySeq + 1) & 0xff;
    if (sonySeq === 0) {
      while (tick <= sonyLastTick) {
        tick = Math.floor(Date.now() / 10);
      }
    }
  } else {
    sonySeq = 0;
  }
  sonyLastTick = tick;
  const id =
    ((BigInt(tick) - BigInt(Math.floor(SONY_EPOCH_MS / 10))) << 24n) |
    (BigInt(sonySeq) << 16n) |
    BigInt(machine);
  return id.toString();
}

/** Local increment<<32 | random32. Production must share the increment. */
export function generateMistId(): string {
  mistCounter += 1;
  const mixed =
    (BigInt(mistCounter & 0xffffffff) << 32n) | BigInt(randomBytes(4).readUInt32BE(0));
  return mixed.toString();
}

/** 20 bytes: 32-bit KSUID epoch seconds + 16 random; Base62 27 chars. */
export function generateKsuid(): string {
  const ts = (Math.floor(Date.now() / 1000) - KSUID_EPOCH) >>> 0;
  const payload = Buffer.alloc(20);
  payload.writeUInt32BE(ts, 0);
  randomBytes(16).copy(payload, 4);
  return encodeBase62(payload, 27);
}

/** 12 bytes: time + machine + pid + counter; Crockford 20 chars. */
export function generateXid(): string {
  xidCounter = (xidCounter + 1) & 0xffffff;
  const raw = Buffer.alloc(12);
  raw.writeUInt32BE(Math.floor(Date.now() / 1000), 0);
  NODE_BYTES.subarray(0, 3).copy(raw, 4);
  raw.writeUInt16BE(process.pid & 0xffff, 7);
  raw[9] = (xidCounter >> 16) & 0xff;
  raw[10] = (xidCounter >> 8) & 0xff;
  raw[11] = xidCounter & 0xff;
  return encodeCrockford(BigInt("0x" + raw.toString("hex")), 20);
}

export const LOCAL_WARNINGS: Record<string, string> = {
  mist_id: "Process-local counter only. Production mist_id needs a shared increment (Redis/DB).",
  uuid_v8: "Local custom UUID v8. Production should coordinate node/counter bits.",
};

type GenOpts = { worker: number; name?: string };

const GENERATORS: Record<string, (opts: GenOpts) => string> = {
  entropy_id: () => generateEntropyId(),
  js_safety_id: () => generateJsSafetyId(),
  uuid_v1: () => generateUuidV1(),
  uuid_v3: ({ name }) => {
    if (!name) throw new Error("uuid_v3 requires name");
    return generateUuidV3(name);
  },
  uuid_v4: () => generateUuidV4(),
  uuid_v5: ({ name }) => {
    if (!name) throw new Error("uuid_v5 requires name");
    return generateUuidV5(name);
  },
  uuid_v6: () => generateUuidV6(),
  uuid_v7: () => generateUuidV7(),
  uuid_v8: () => generateUuidV8(),
  ulid: () => generateUlid(),
  nano_id: () => generateNanoId(),
  object_id: () => generateObjectId(),
  snowflake: ({ worker }) => generateSnowflake(worker),
  sonyflake: ({ worker }) => generateSonyflake(worker),
  mist_id: () => generateMistId(),
  ksuid: () => generateKsuid(),
  xid: () => generateXid(),
};

export function canGenerate(slug: string): boolean {
  return Object.hasOwn(GENERATORS, slug);
}

export interface GenerateResult {
  ids: string[];
  warning?: string;
}

export function generateLocal(
  slug: string,
  count: number,
  opts: { worker?: number; name?: string } = {},
): GenerateResult {
  const fn = GENERATORS[slug];
  if (!fn) {
    throw new Error(`No local generator for ${slug}`);
  }
  const worker = opts.worker ?? 0;
  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    ids.push(fn({ worker, name: opts.name }));
  }
  let warning = LOCAL_WARNINGS[slug];
  if (slug === "snowflake" || slug === "sonyflake") {
    warning = `worker=${worker} (0–1023 snowflake / 0–65535 sonyflake). Duplicate workers duplicate IDs.`;
  }
  return warning ? { ids, warning } : { ids };
}
