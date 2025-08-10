from __future__ import annotations

from typing import Any, Dict

from fastapi.testclient import TestClient

from gbizinfo_mcp.app import app
from gbizinfo_mcp.controller import router as router_module
from gbizinfo_mcp.model import Company, PaginatedResult


class FakeService:
    def search_companies(self, **kwargs: Any) -> PaginatedResult[Company]:  # noqa: ARG002
        return PaginatedResult[Company](
            items=[
                Company(
                    corporate_number="1234567890123",
                    name="テスト株式会社",
                    prefecture="東京都",
                )
            ],
            total=1,
            from_=1,
            size=1,
        )

    def get_basic_info(self, corporate_number: str) -> Dict[str, Any]:  # noqa: ARG002
        return {
            "hojin-infos": [
                {
                    "corporate_number": "1234567890123",
                    "name": "テスト株式会社",
                }
            ]
        }


def test_search_companies_endpoint(monkeypatch):
    monkeypatch.setattr(router_module, "service", FakeService())
    client = TestClient(app)
    resp = client.get("/api/companies", params={"name": "テスト", "page": 1, "limit": 1})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert isinstance(data.get("items"), list) and len(data["items"]) == 1
    assert data["items"][0]["corporate_number"] == "1234567890123"


def test_get_company_basic_endpoint(monkeypatch):
    monkeypatch.setattr(router_module, "service", FakeService())
    client = TestClient(app)
    resp = client.get("/api/companies/1234567890123")
    assert resp.status_code == 200
    data = resp.json()
    assert "hojin-infos" in data and isinstance(data["hojin-infos"], list)
    assert data["hojin-infos"][0]["corporate_number"] == "1234567890123"
