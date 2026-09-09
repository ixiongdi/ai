#!/usr/bin/env python3
"""Executable CLI for the id-generator skill. Run; do not reimplement."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Allow `python scripts/idgen.py` from the skill root or scripts/.
sys.path.insert(0, str(Path(__file__).resolve().parent))

from lib.catalog import filter_algs, get, slugs  # noqa: E402
from lib.generate import GENERATORS, generate  # noqa: E402
from lib.recommend import recommend  # noqa: E402

_HELP_EXAMPLES = """\
Examples:
  python3 scripts/idgen.py recommend --output long --coordination none --json
  python3 scripts/idgen.py generate uuid_v7 -n 5
  python3 scripts/idgen.py generate uuid_v5 --name orders:42
  python3 scripts/idgen.py generate snowflake -n 3 --worker 7
"""


def _count(value: str) -> int:
    try:
        n = int(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("--count must be an integer") from exc
    if not 1 <= n <= 32:
        raise argparse.ArgumentTypeError("--count must be 1..32")
    return n


def _dump(obj: object, as_json: bool, text: str) -> int:
    print(json.dumps(obj, indent=2, ensure_ascii=False) if as_json else text)
    return 0


def cmd_list(args: argparse.Namespace) -> int:
    rows = filter_algs(
        coordination=args.coordination,
        output=args.output,
        python=True if args.python else None,
    )
    payload = {
        "total": len(rows),
        "items": [
            {
                "slug": a["slug"],
                "output": a["output"],
                "sortable": a["sortable"],
                "coordination": a["coordination"],
                "python": a["python"],
                "description": a["description"],
            }
            for a in rows
        ],
    }
    lines = [
        "slug\toutput\tsortable\tcoord\tpython",
        *[
            f"{a['slug']}\t{a['output']}\t{a['sortable']}\t{a['coordination']}\t{a['python']}"
            for a in rows
        ],
    ]
    return _dump(payload, args.json, "\n".join(lines))


def cmd_recommend(args: argparse.Namespace) -> int:
    rec = recommend(
        output=args.output,
        coordination=args.coordination,
        js_safe=args.js_safe,
        url_safe=args.url_safe,
        mongo=args.mongo,
        lexicographic=args.lexicographic,
        snowflake=args.snowflake,
    )
    primary = rec["primary"]
    payload = {
        "primary": primary["slug"],
        "reason": rec["reason"],
        "alternatives": [a["slug"] for a in rec["alternatives"]],
        "python": primary["python"],
    }
    text = (
        f"{primary['slug']}\n{rec['reason']}\n"
        f"alternatives: {', '.join(payload['alternatives'])}"
    )
    return _dump(payload, args.json, text)


def cmd_generate(args: argparse.Namespace) -> int:
    row = get(args.slug)
    if row is None:
        print(f"Error: unknown algorithm '{args.slug}'. Valid: {', '.join(slugs())}", file=sys.stderr)
        return 2
    if not row["python"]:
        print(
            f"Error: '{args.slug}' has no Python generator. "
            f"Implemented: {', '.join(sorted(GENERATORS))}",
            file=sys.stderr,
        )
        return 2
    try:
        ids, warning = generate(
            args.slug,
            args.count,
            worker=args.worker,
            name=args.name,
        )
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2
    payload: dict = {"algorithm": args.slug, "ids": ids, "count": len(ids)}
    if warning:
        payload["warning"] = warning
    if args.json:
        return _dump(payload, True, "")
    if warning:
        print(f"# {warning}", file=sys.stderr)
    print("\n".join(ids))
    return 0


def cmd_explain(args: argparse.Namespace) -> int:
    row = get(args.slug)
    if row is None:
        print(f"Error: unknown algorithm '{args.slug}'. Valid: {', '.join(slugs())}", file=sys.stderr)
        return 2
    payload = dict(row)
    text = "\n".join(
        [
            f"slug: {row['slug']}",
            f"output: {row['output']}",
            f"sortable: {row['sortable']}",
            f"coordination: {row['coordination']}",
            f"python: {row['python']}",
            f"description: {row['description']}",
        ]
    )
    return _dump(payload, args.json, text)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        description="Language-agnostic ID algorithms (Python implementations).",
        epilog=_HELP_EXAMPLES,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    pl = sub.add_parser("list", help="List algorithms")
    pl.add_argument("--coordination", choices=["none", "shared", "worker"])
    pl.add_argument("--output", choices=["long", "string", "uuid", "binary"])
    pl.add_argument("--python", action="store_true", help="Only slugs with a Python generator")
    pl.add_argument("--json", action="store_true")
    pl.set_defaults(func=cmd_list)

    pr = sub.add_parser("recommend", help="Recommend a slug")
    pr.add_argument("--output", choices=["long", "string"], default="long")
    pr.add_argument("--coordination", choices=["none", "shared"], default="none")
    pr.add_argument("--js-safe", action="store_true")
    pr.add_argument("--url-safe", action="store_true")
    pr.add_argument("--mongo", action="store_true")
    pr.add_argument("--lexicographic", action="store_true")
    pr.add_argument("--snowflake", action="store_true")
    pr.add_argument("--json", action="store_true")
    pr.set_defaults(func=cmd_recommend)

    pg = sub.add_parser("generate", help="Generate IDs")
    pg.add_argument("slug")
    pg.add_argument(
        "-n",
        "--count",
        type=_count,
        default=1,
        metavar="N",
        help="How many IDs (1-32, default 1)",
    )
    pg.add_argument("--worker", type=int, default=0)
    pg.add_argument("--name", help="Required for uuid_v3 / uuid_v5")
    pg.add_argument("--json", action="store_true")
    pg.set_defaults(func=cmd_generate)

    pe = sub.add_parser("explain", help="Explain one slug")
    pe.add_argument("slug")
    pe.add_argument("--json", action="store_true")
    pe.set_defaults(func=cmd_explain)

    args = p.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
