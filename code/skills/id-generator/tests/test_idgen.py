"""CLI tests: invoke scripts/idgen.py the way an agent would."""

from __future__ import annotations

import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IDGEN = ROOT / "scripts" / "idgen.py"
UUID_V7 = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
    re.I,
)


def _run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(IDGEN), *args],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )


class IdgenCliTests(unittest.TestCase):
    def test_recommend_uncoordinated_long(self) -> None:
        proc = _run("recommend", "--output", "long", "--coordination", "none", "--json")
        self.assertEqual(proc.returncode, 0, proc.stderr)
        payload = json.loads(proc.stdout)
        self.assertEqual(payload["primary"], "entropy_id")

    def test_generate_uuid_v7_count_two(self) -> None:
        proc = _run("generate", "uuid_v7", "-n", "2")
        self.assertEqual(proc.returncode, 0, proc.stderr)
        lines = [ln for ln in proc.stdout.strip().splitlines() if ln]
        self.assertEqual(len(lines), 2)
        for line in lines:
            self.assertRegex(line, UUID_V7)

    def test_generate_mist_id_warns_on_stderr(self) -> None:
        proc = _run("generate", "mist_id")
        self.assertEqual(proc.returncode, 0, proc.stderr)
        self.assertRegex(proc.stdout.strip(), r"^[0-9]+$")
        self.assertRegex(proc.stderr, r"shared increment|Process-local", proc.stderr)

    def test_unknown_slug_exits_2(self) -> None:
        proc = _run("generate", "not_a_real_slug")
        self.assertEqual(proc.returncode, 2)
        self.assertRegex(proc.stderr, r"unknown algorithm")
        self.assertRegex(proc.stderr, r"Valid:")

    def test_uuid_v3_without_name_exits_2(self) -> None:
        proc = _run("generate", "uuid_v3")
        self.assertEqual(proc.returncode, 2)
        self.assertRegex(proc.stderr, r"requires --name")

    def test_help_lists_examples(self) -> None:
        proc = _run("--help")
        self.assertEqual(proc.returncode, 0, proc.stderr)
        self.assertIn("recommend --output long", proc.stdout)
        self.assertIn("uuid_v5 --name", proc.stdout)


if __name__ == "__main__":
    unittest.main()
