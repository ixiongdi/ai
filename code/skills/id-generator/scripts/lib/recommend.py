"""Decision tree — language-agnostic."""

from __future__ import annotations

from typing import Any

from .catalog import get


def _must(slug: str) -> dict[str, Any]:
    row = get(slug)
    if row is None:
        raise KeyError(slug)
    return row


def recommend(
    *,
    output: str = "long",
    coordination: str = "none",
    js_safe: bool = False,
    url_safe: bool = False,
    mongo: bool = False,
    lexicographic: bool = False,
    snowflake: bool = False,
) -> dict[str, Any]:
    if js_safe:
        return {
            "primary": _must("js_safety_id"),
            "alternatives": [_must("uuid_v7")],
            "reason": "JavaScript Number is safe only to 2^53−1. Use js_safety_id, or stringify 64-bit IDs (uuid_v7).",
        }
    if mongo:
        return {
            "primary": _must("object_id"),
            "alternatives": [_must("uuid_v7")],
            "reason": "Mongo-style 12-byte ObjectId with a timestamp prefix.",
        }
    if url_safe:
        return {
            "primary": _must("nano_id"),
            "alternatives": [_must("ulid"), _must("xid")],
            "reason": "NanoId is compact and URL-safe. ULID/XID if you also need time order.",
        }
    if lexicographic and output == "string":
        return {
            "primary": _must("ulid"),
            "alternatives": [_must("uuid_v7"), _must("ksuid")],
            "reason": "ULID is 26-char Crockford Base32 and sorts lexicographically by time.",
        }
    if snowflake:
        return {
            "primary": _must("snowflake"),
            "alternatives": [_must("entropy_id"), _must("mist_id")],
            "reason": "Snowflake needs a unique worker per instance. Entropy needs none; mist needs a shared counter.",
        }
    if coordination == "shared" and output == "long":
        return {
            "primary": _must("mist_id"),
            "alternatives": [_must("snowflake")],
            "reason": "Coordinated 64-bit pick is mist_id (shared increment + random). Production must share the counter.",
        }
    if coordination == "shared":
        return {
            "primary": _must("uuid_v8"),
            "alternatives": [_must("uuid_v7")],
            "reason": "Coordinated string pick is uuid_v8. uuid_v7 is the uncoordinated alternative.",
        }
    if output == "long":
        return {
            "primary": _must("entropy_id"),
            "alternatives": [_must("snowflake"), _must("js_safety_id")],
            "reason": "Uncoordinated 64-bit pick is entropy_id. Not strictly monotonic within the same second. Unsafe as JS Number.",
        }
    return {
        "primary": _must("uuid_v7"),
        "alternatives": [_must("ulid"), _must("nano_id")],
        "reason": "Uncoordinated string pick is uuid_v7. Prefer over uuid_v4 for B-tree primary keys.",
    }
