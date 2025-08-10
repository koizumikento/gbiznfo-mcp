from __future__ import annotations

import re

_CN_PATTERN = re.compile(r"^[0-9]{13}$")
_YMD_PATTERN = re.compile(r"^[0-9]{8}$")


def validate_corporate_number(value: str) -> str:
    if not isinstance(value, str) or not _CN_PATTERN.fullmatch(value):
        raise ValueError("corporate_number must be 13 digits")
    return value


def validate_yyyymmdd(value: str) -> str:
    if not isinstance(value, str) or not _YMD_PATTERN.fullmatch(value):
        raise ValueError("date must be yyyyMMdd (8 digits)")
    return value
