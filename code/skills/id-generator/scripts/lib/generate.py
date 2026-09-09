"""Python ID generators — bit layouts for this skill.

Port this module when the application is not Python. Stdlib only.
"""

from __future__ import annotations

import os
import socket
import threading
import time
import uuid
from secrets import randbits, token_bytes
from typing import Callable

MASK64 = (1 << 64) - 1
ENTROPY_EPOCH = 1746028800
JS_EPOCH_OFFSET = 1645557742
TWITTER_EPOCH_MS = 1288834974657
KSUID_EPOCH = 1_400_000_000
SONY_EPOCH_MS = 1409529600000  # 2014-09-01 UTC

_lock = threading.Lock()
_entropy_counter = 0
_snowflake_seq = 0
_snowflake_last = -1
_sony_seq = 0
_sony_last = -1
_object_counter = randbits(24)
_mist_counter = 0
_xid_counter = randbits(24)

_CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
_NANO = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-"
_BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"


def _fnv1a64(data: bytes) -> int:
    h = 0xCBF29CE484222325
    for b in data:
        h ^= b
        h = (h * 0x100000001B3) & MASK64
    return h


_NODE = _fnv1a64(socket.gethostname().encode() or b"id-generator")


def _splitmix64(x: int) -> int:
    x &= MASK64
    x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
    x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & MASK64
    return (x ^ (x >> 31)) & MASK64


def _encode_crockford(value: int, length: int) -> str:
    chars: list[str] = []
    for _ in range(length):
        chars.append(_CROCKFORD[value & 31])
        value >>= 5
    return "".join(reversed(chars))


def _b62(data: bytes, length: int) -> str:
    n = int.from_bytes(data, "big")
    chars: list[str] = []
    for _ in range(length):
        n, rem = divmod(n, 62)
        chars.append(_BASE62[rem])
    return "".join(reversed(chars))


def entropy_id() -> str:
    """64-bit: high 32 = seconds since 1746028800; low 32 = mixed entropy."""
    global _entropy_counter
    with _lock:
        _entropy_counter += 1
        counter = _entropy_counter
    ts = (int(time.time()) - ENTROPY_EPOCH) & 0xFFFFFFFF
    mixed = time.perf_counter_ns() ^ counter ^ _NODE ^ randbits(64)
    ent = _splitmix64(mixed) & 0xFFFFFFFF
    return str((ts << 32) | ent)


def js_safety_id() -> str:
    """53-bit: ((now_ms - 1645557742) // 16) << 16 | 16-bit random."""
    ts = ((int(time.time() * 1000) - JS_EPOCH_OFFSET) // 16) * 65536
    return str(ts + randbits(16))


def uuid_v1() -> str:
    return str(uuid.uuid1())


def uuid_v3(name: str) -> str:
    return str(uuid.uuid3(uuid.NAMESPACE_URL, name))


def uuid_v4() -> str:
    return str(uuid.uuid4())


def uuid_v5(name: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, name))


def _format_uuid(buf: bytearray) -> str:
    h = buf.hex()
    return f"{h[0:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def uuid_v6() -> str:
    """RFC 9562 UUID v6 from a v1 timestamp."""
    u = uuid.uuid1()
    greg = u.time & ((1 << 60) - 1)
    out = bytearray(16)
    out[0:6] = (greg >> 12).to_bytes(6, "big")
    out[6] = 0x60 | ((greg >> 8) & 0x0F)
    out[7] = greg & 0xFF
    out[8:16] = u.bytes[8:16]
    out[8] = (out[8] & 0x3F) | 0x80
    return _format_uuid(out)


def uuid_v7() -> str:
    """RFC 9562 UUID version 7."""
    buf = bytearray(token_bytes(16))
    ts = int(time.time() * 1000)
    buf[0:6] = ts.to_bytes(6, "big")
    buf[6] = (buf[6] & 0x0F) | 0x70
    buf[8] = (buf[8] & 0x3F) | 0x80
    return _format_uuid(buf)


def uuid_v8() -> str:
    """UUID v8: Unix-ms + custom bits (local node; coordinate node in production)."""
    buf = bytearray(token_bytes(16))
    ts = int(time.time() * 1000)
    buf[0:6] = ts.to_bytes(6, "big")
    buf[6] = (buf[6] & 0x0F) | 0x80
    buf[8] = (buf[8] & 0x3F) | 0x80
    return _format_uuid(buf)


def ulid() -> str:
    ts = int(time.time() * 1000) & ((1 << 48) - 1)
    rand = randbits(80)
    return _encode_crockford(ts, 10) + _encode_crockford(rand, 16)


def nano_id(size: int = 21) -> str:
    raw = token_bytes(size)
    return "".join(_NANO[b & 63] for b in raw)


def object_id() -> str:
    global _object_counter
    with _lock:
        _object_counter = (_object_counter + 1) & 0xFFFFFF
        c = _object_counter
    buf = int(time.time()).to_bytes(4, "big") + token_bytes(5) + c.to_bytes(3, "big")
    return buf.hex()


def snowflake(worker: int = 0) -> str:
    """Twitter Snowflake: 41-bit ms, 10-bit worker, 12-bit sequence."""
    global _snowflake_seq, _snowflake_last
    worker = worker & 0x3FF
    with _lock:
        ts = int(time.time() * 1000)
        if ts == _snowflake_last:
            _snowflake_seq = (_snowflake_seq + 1) & 0xFFF
            if _snowflake_seq == 0:
                while ts <= _snowflake_last:
                    ts = int(time.time() * 1000)
        else:
            _snowflake_seq = 0
        _snowflake_last = ts
        seq = _snowflake_seq
    return str(((ts - TWITTER_EPOCH_MS) << 22) | (worker << 12) | seq)


def sonyflake(worker: int = 0) -> str:
    """Sonyflake: 39-bit 10ms ticks, 8-bit sequence, 16-bit machine."""
    global _sony_seq, _sony_last
    machine = worker & 0xFFFF
    with _lock:
        tick = int(time.time() * 1000) // 10
        if tick == _sony_last:
            _sony_seq = (_sony_seq + 1) & 0xFF
            if _sony_seq == 0:
                while tick <= _sony_last:
                    tick = int(time.time() * 1000) // 10
        else:
            _sony_seq = 0
        _sony_last = tick
        seq = _sony_seq
    return str(((tick - SONY_EPOCH_MS // 10) << 24) | (seq << 16) | machine)


def mist_id() -> str:
    """Local increment<<32 | random32. Production must share the increment."""
    global _mist_counter
    with _lock:
        _mist_counter += 1
        c = _mist_counter
    return str(((c & 0xFFFFFFFF) << 32) | randbits(32))


def ksuid() -> str:
    """20 bytes: 32-bit KSUID epoch seconds + 16 random; Base62 27 chars."""
    ts = (int(time.time()) - KSUID_EPOCH) & 0xFFFFFFFF
    payload = ts.to_bytes(4, "big") + token_bytes(16)
    return _b62(payload, 27)


def xid() -> str:
    """12 bytes: time + machine + pid + counter; Crockford 20 chars."""
    global _xid_counter
    with _lock:
        _xid_counter = (_xid_counter + 1) & 0xFFFFFF
        c = _xid_counter
    machine = _NODE.to_bytes(8, "big")[-3:]
    pid = (os.getpid() & 0xFFFF).to_bytes(2, "big")
    raw = int(time.time()).to_bytes(4, "big") + machine + pid + c.to_bytes(3, "big")
    n = int.from_bytes(raw, "big")
    return _encode_crockford(n, 20)


GENERATORS: dict[str, Callable[..., str]] = {
    "entropy_id": entropy_id,
    "js_safety_id": js_safety_id,
    "uuid_v1": uuid_v1,
    "uuid_v3": uuid_v3,
    "uuid_v4": uuid_v4,
    "uuid_v5": uuid_v5,
    "uuid_v6": uuid_v6,
    "uuid_v7": uuid_v7,
    "uuid_v8": uuid_v8,
    "ulid": ulid,
    "nano_id": nano_id,
    "object_id": object_id,
    "snowflake": snowflake,
    "sonyflake": sonyflake,
    "mist_id": mist_id,
    "ksuid": ksuid,
    "xid": xid,
}

LOCAL_WARNINGS = {
    "mist_id": "Process-local counter only. Production mist_id needs a shared increment (Redis/DB).",
    "uuid_v8": "Local custom UUID v8. Production should coordinate node/counter bits.",
}


def generate(
    slug: str,
    count: int = 1,
    *,
    worker: int = 0,
    name: str | None = None,
) -> tuple[list[str], str | None]:
    fn = GENERATORS.get(slug)
    if fn is None:
        raise ValueError(f"No Python generator for '{slug}'")
    ids: list[str] = []
    for _ in range(count):
        if slug in ("uuid_v3", "uuid_v5"):
            if not name:
                raise ValueError(f"{slug} requires --name")
            ids.append(fn(name))
        elif slug in ("snowflake", "sonyflake"):
            ids.append(fn(worker))
        else:
            ids.append(fn())
    warning = LOCAL_WARNINGS.get(slug)
    if slug in ("snowflake", "sonyflake"):
        warning = f"worker={worker} (0–1023 snowflake / 0–65535 sonyflake). Duplicate workers duplicate IDs."
    return ids, warning
