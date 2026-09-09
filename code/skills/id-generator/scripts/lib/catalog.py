"""Algorithm catalog (language-agnostic)."""

from __future__ import annotations

from typing import Any

# python: True = scripts/idgen.py generate <slug>
ALGORITHMS: list[dict[str, Any]] = [
    {"slug": "bro_id", "output": "binary", "sortable": "no", "coordination": "none", "python": False,
     "description": "Custom binary ID"},
    {"slug": "comb_guid", "output": "uuid", "sortable": "time", "coordination": "none", "python": False,
     "description": "COMB GUID with time-ordered bytes"},
    {"slug": "cos_id", "output": "long", "sortable": "time", "coordination": "worker", "python": False,
     "description": "Configurable CosId-style distributed ID"},
    {"slug": "cuid_v1", "output": "string", "sortable": "no", "coordination": "none", "python": False,
     "description": "CUID v1"},
    {"slug": "cuid_v2", "output": "string", "sortable": "no", "coordination": "none", "python": False,
     "description": "CUID v2"},
    {"slug": "dts_id", "output": "long", "sortable": "time", "coordination": "none", "python": False,
     "description": "Distributed time-service ID"},
    {"slug": "elastic_flake", "output": "string", "sortable": "time", "coordination": "worker", "python": False,
     "description": "Snowflake variant for Elasticsearch"},
    {"slug": "flake", "output": "long", "sortable": "time", "coordination": "worker", "python": False,
     "description": "Flake (time, machine, sequence)"},
    {"slug": "flake_id", "output": "long", "sortable": "time", "coordination": "worker", "python": False,
     "description": "Extended flake"},
    {"slug": "flex_id", "output": "long", "sortable": "mono", "coordination": "none", "python": False,
     "description": "Framework sequence-style ID"},
    {"slug": "js_safety_id", "output": "long", "sortable": "time", "coordination": "none", "python": True,
     "description": "53-bit integer safe for JavaScript Number"},
    {"slug": "ksuid", "output": "string", "sortable": "time", "coordination": "none", "python": True,
     "description": "K-sortable Base62 ID"},
    {"slug": "lexical_uuid", "output": "uuid", "sortable": "lex", "coordination": "none", "python": False,
     "description": "Lexicographically sortable UUID"},
    {"slug": "mist_id", "output": "long", "sortable": "mono", "coordination": "shared", "python": True,
     "description": "Increment + random; production increment must be shared",
     "local_only": True},
    {"slug": "nano_id", "output": "string", "sortable": "no", "coordination": "none", "python": True,
     "description": "Compact URL-safe string"},
    {"slug": "object_id", "output": "string", "sortable": "time", "coordination": "none", "python": True,
     "description": "Mongo-style 12-byte hex ObjectId"},
    {"slug": "ordered_uuid", "output": "uuid", "sortable": "time", "coordination": "none", "python": False,
     "description": "Time-ordered UUID"},
    {"slug": "push_id", "output": "string", "sortable": "time", "coordination": "none", "python": False,
     "description": "Firebase-style push ID"},
    {"slug": "atomic_id", "output": "long", "sortable": "mono", "coordination": "shared", "python": False,
     "description": "Shared atomic long"},
    {"slug": "rid", "output": "string", "sortable": "mono", "coordination": "shared", "python": False,
     "description": "Shared generic ID"},
    {"slug": "segment_chain_id", "output": "long", "sortable": "mono", "coordination": "shared", "python": False,
     "description": "Segment-chain allocator"},
    {"slug": "sid", "output": "string", "sortable": "no", "coordination": "none", "python": False,
     "description": "Session-style ID"},
    {"slug": "sharding_id", "output": "long", "sortable": "time", "coordination": "worker", "python": False,
     "description": "Shard-friendly ID"},
    {"slug": "snowflake", "output": "long", "sortable": "time", "coordination": "worker", "python": True,
     "description": "Twitter Snowflake 64-bit"},
    {"slug": "sonyflake", "output": "long", "sortable": "time", "coordination": "worker", "python": True,
     "description": "Sonyflake (10ms tick, 16-bit sequence, 16-bit machine)"},
    {"slug": "business_id", "output": "long", "sortable": "time", "coordination": "none", "python": False,
     "description": "Time-based business ID"},
    {"slug": "entropy_id", "output": "long", "sortable": "time", "coordination": "none", "python": True,
     "description": "32-bit seconds + 32-bit mixed entropy; no worker"},
    {"slug": "tts_id", "output": "long", "sortable": "time", "coordination": "none", "python": False,
     "description": "Timestamp + sequence"},
    {"slug": "ulid", "output": "string", "sortable": "lex", "coordination": "none", "python": True,
     "description": "26-char Crockford Base32, lexicographically sortable"},
    {"slug": "uuid_v1", "output": "uuid", "sortable": "time", "coordination": "none", "python": True,
     "description": "UUID v1 (time + node)"},
    {"slug": "uuid_v2", "output": "uuid", "sortable": "time", "coordination": "none", "python": False,
     "description": "UUID v2 DCE"},
    {"slug": "uuid_v3", "output": "uuid", "sortable": "no", "coordination": "none", "python": True,
     "description": "UUID v3 name/MD5 (discouraged)", "needs_name": True},
    {"slug": "uuid_v4", "output": "uuid", "sortable": "no", "coordination": "none", "python": True,
     "description": "UUID v4 random; poor default clustered PK"},
    {"slug": "uuid_v5", "output": "uuid", "sortable": "no", "coordination": "none", "python": True,
     "description": "UUID v5 name/SHA-1", "needs_name": True},
    {"slug": "uuid_v6", "output": "uuid", "sortable": "time", "coordination": "none", "python": True,
     "description": "UUID v6 reordered Gregorian time"},
    {"slug": "uuid_v7", "output": "uuid", "sortable": "time", "coordination": "none", "python": True,
     "description": "UUID v7 Unix-ms ordered"},
    {"slug": "uuid_v8", "output": "uuid", "sortable": "time", "coordination": "shared", "python": True,
     "description": "UUID v8 custom; production node bits should be coordinated",
     "local_only": True},
    {"slug": "wx_seq", "output": "long", "sortable": "mono", "coordination": "none", "python": False,
     "description": "WeChat-style sequence"},
    {"slug": "xid", "output": "string", "sortable": "time", "coordination": "none", "python": True,
     "description": "Compact 20-char XID"},
]

BY_SLUG = {a["slug"]: a for a in ALGORITHMS}


def get(slug: str) -> dict[str, Any] | None:
    return BY_SLUG.get(slug)


def slugs() -> list[str]:
    return [a["slug"] for a in ALGORITHMS]


def filter_algs(
    *,
    coordination: str | None = None,
    output: str | None = None,
    python: bool | None = None,
) -> list[dict[str, Any]]:
    rows = ALGORITHMS
    if coordination:
        rows = [a for a in rows if a["coordination"] == coordination]
    if output:
        rows = [a for a in rows if a["output"] == output]
    if python is not None:
        rows = [a for a in rows if a["python"] is python]
    return rows
