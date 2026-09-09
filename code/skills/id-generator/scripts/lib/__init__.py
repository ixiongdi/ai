"""Python implementations of ID algorithms. Prefer scripts/idgen.py CLI."""

from .catalog import get, slugs
from .generate import generate
from .recommend import recommend

__all__ = ["generate", "get", "recommend", "slugs"]
