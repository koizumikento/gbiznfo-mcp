from __future__ import annotations

from fastapi.testclient import TestClient

from gbizinfo_mcp.app import app
from gbizinfo_mcp.controller import router as router_module
from gbizinfo_mcp.model import Company, UpdateInfoPage


class FakeService:
    def get_update_info(self, *, from_: str, to: str, page: int = 1) -> UpdateInfoPage:  # noqa: ARG002
        return UpdateInfoPage(
            items=[Company(corporate_number="1234567890123", name="更新テスト")],
            pageNumber=1,
            totalCount=1,
            totalPage=1,
        )

    # category variants
    get_update_info_certification = get_update_info
    get_update_info_commendation = get_update_info
    get_update_info_finance = get_update_info
    get_update_info_patent = get_update_info
    get_update_info_procurement = get_update_info
    get_update_info_subsidy = get_update_info
    get_update_info_workplace = get_update_info


def test_updates_basic(monkeypatch):
    monkeypatch.setattr(router_module, "service", FakeService())
    client = TestClient(app)
    resp = client.get("/api/updates", params={"from": "20250101", "to": "20250131", "page": 1})
    assert resp.status_code == 200
    data = resp.json()
    assert data["pageNumber"] == 1
    assert data["totalCount"] == 1
    assert data["totalPage"] == 1
    assert data["items"][0]["corporate_number"] == "1234567890123"


def test_updates_date_validation_error(monkeypatch):
    monkeypatch.setattr(router_module, "service", FakeService())
    client = TestClient(app)
    resp = client.get("/api/updates", params={"from": "2025-01-01", "to": "20250131"})
    assert resp.status_code == 400


def test_updates_category_routes(monkeypatch):
    monkeypatch.setattr(router_module, "service", FakeService())
    client = TestClient(app)
    categories = [
        "certification",
        "commendation",
        "finance",
        "patent",
        "procurement",
        "subsidy",
        "workplace",
    ]
    for cat in categories:
        resp = client.get(f"/api/updates/{cat}", params={"from": "20250101", "to": "20250131"})
        assert resp.status_code == 200
        assert resp.json()["pageNumber"] == 1
