from __future__ import annotations

from typing import Any, Dict, Optional

from fastmcp import FastMCP

from .errors import InputValidationError
from .model.search import CompanySearchQuery
from .services.gbizinfo_service import GBizInfoService
from .utils.validation import validate_corporate_number

mcp = FastMCP(name="gbizinfo-mcp")
service = GBizInfoService()


@mcp.tool(
    name="search",
    description=(
        "gBizINFO を複合条件で検索します（Swaggerの検索クエリを個別パラメータで受け付け）。"
    ),
)
def search(query: CompanySearchQuery) -> Dict[str, Any]:
    """gBizINFO を複合条件で検索します（Swaggerの検索クエリを個別パラメータで受け付け）。"""
    page = service.search_companies(**query.model_dump(exclude_none=True))
    return {
        "items": [i.model_dump() for i in page.items],
        "total": page.total,
        "from": page.from_,
        "size": page.size,
    }


def _corporate_arg(arg: Optional[str]) -> str:
    if arg is None:
        raise InputValidationError("corporateNumber is required")
    return validate_corporate_number(arg)


@mcp.tool(name="get_basic_info", description="法人番号で基本情報を取得します。")
def get_basic_info(corporateNumber: Optional[str] = None) -> Any:  # noqa: N803
    return service.get_basic_info(_corporate_arg(corporateNumber))


@mcp.tool(name="get_certification", description="法人番号で届出・認定情報を取得します。")
def get_certification(corporateNumber: Optional[str] = None) -> Any:  # noqa: N803
    return service.get_certification(_corporate_arg(corporateNumber))


@mcp.tool(name="get_commendation", description="法人番号で表彰情報を取得します。")
def get_commendation(corporateNumber: Optional[str] = None) -> Any:  # noqa: N803
    return service.get_commendation(_corporate_arg(corporateNumber))


@mcp.tool(name="get_finance", description="法人番号で財務情報を取得します。")
def get_finance(corporateNumber: Optional[str] = None) -> Any:  # noqa: N803
    return service.get_finance(_corporate_arg(corporateNumber))


@mcp.tool(name="get_patent", description="法人番号で特許情報を取得します。")
def get_patent(corporateNumber: Optional[str] = None) -> Any:  # noqa: N803
    return service.get_patent(_corporate_arg(corporateNumber))


@mcp.tool(name="get_procurement", description="法人番号で調達情報を取得します。")
def get_procurement(corporateNumber: Optional[str] = None) -> Any:  # noqa: N803
    return service.get_procurement(_corporate_arg(corporateNumber))


@mcp.tool(name="get_subsidy", description="法人番号で補助金情報を取得します。")
def get_subsidy(corporateNumber: Optional[str] = None) -> Any:  # noqa: N803
    return service.get_subsidy(_corporate_arg(corporateNumber))


@mcp.tool(name="get_workplace", description="法人番号で職場情報を取得します。")
def get_workplace(corporateNumber: Optional[str] = None) -> Any:  # noqa: N803
    return service.get_workplace(_corporate_arg(corporateNumber))


if __name__ == "__main__":
    mcp.run()
