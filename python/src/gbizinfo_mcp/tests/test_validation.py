from __future__ import annotations

import pytest

from gbizinfo_mcp.model.search import CompanySearchQuery
from gbizinfo_mcp.utils.validation import validate_corporate_number, validate_yyyymmdd


def test_validate_corporate_number_ok():
    assert validate_corporate_number("1234567890123") == "1234567890123"


def test_validate_corporate_number_ng():
    with pytest.raises(ValueError):
        validate_corporate_number("123")


def test_validate_yyyymmdd_ok():
    assert validate_yyyymmdd("20250101") == "20250101"


def test_validate_yyyymmdd_ng():
    with pytest.raises(ValueError):
        validate_yyyymmdd("2025-01-01")


def test_company_search_query_page_limit_bounds():
    q = CompanySearchQuery(page=10, limit=5000)
    assert q.page == 10
    assert q.limit == 5000

    with pytest.raises(Exception):  # noqa: B017
        CompanySearchQuery(page=11)

    with pytest.raises(Exception):  # noqa: B017
        CompanySearchQuery(limit=5001)


def test_company_search_query_city_requires_prefecture():
    with pytest.raises(Exception):  # noqa: B017
        CompanySearchQuery(city="123")
