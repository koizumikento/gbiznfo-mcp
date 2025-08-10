from __future__ import annotations

from typing import Any, Dict

from gbizinfo_mcp.services.gbizinfo_service import GBizInfoService


class FakeHttp:
    def __init__(self, payload: Dict[str, Any]) -> None:
        self._payload = payload

    def request(self, url: str, options: Any | None = None) -> Any:  # noqa: ARG002
        return self._payload


def test_search_companies_mapping_basic():
    payload = {
        "hojin-infos": [
            {
                "corporate_number": "1234567890123",
                "name": "サンプル株式会社",
                "prefecture_name": "東京都",
                "city_name": "千代田区",
                "address": "丸の内1-1-1",
                "postal_code": "1000000",
                "sic": "製造業",
            }
        ],
        "total": 1,
    }
    service = GBizInfoService(http_client=FakeHttp(payload))
    result = service.search_companies(name="サンプル", page=1, limit=1)
    assert result.total == 1
    assert result.from_ == 1
    assert result.size == 1
    assert len(result.items) == 1
    company = result.items[0]
    assert company.corporate_number == "1234567890123"
    assert company.name == "サンプル株式会社"


def test_get_basic_info_returns_model():
    payload = {
        "hojin-infos": [
            {
                "corporate_number": "1234567890123",
                "name": "テスト会社",
            }
        ]
    }
    service = GBizInfoService(http_client=FakeHttp(payload))
    res = service.get_basic_info("1234567890123")
    # pydantic model
    assert hasattr(res, "hojin_infos")
    assert res.hojin_infos and res.hojin_infos[0].corporate_number == "1234567890123"
