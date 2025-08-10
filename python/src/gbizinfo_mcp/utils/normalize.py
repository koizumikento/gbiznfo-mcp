from __future__ import annotations

from typing import Any, Optional


def to_optional_str(value: Any) -> Optional[str]:
    if value is None:
        return None
    s = str(value).strip()
    return s if s != "" else None


def to_str_or_empty(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()
