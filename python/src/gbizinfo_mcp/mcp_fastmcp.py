from __future__ import annotations

from typing import Any, Dict, Optional, Annotated

from fastmcp import FastMCP
from pydantic import Field

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
def search(
    # NOTE: 以下のパラメータはCompanySearchQueryと同期する必要があります
    # 基本フィルタ
    name: Annotated[Optional[str], Field(description="企業名（部分一致）")] = None,
    corporate_number: Annotated[Optional[str], Field(description="法人番号 (corporate_number)")] = None,
    corporate_type: Annotated[Optional[str], Field(description="法人種別コード（101: 国の機関, 201: 地方公共団体, 301: 株式会社, 302: 有限会社, 303: 合名会社, 304: 合資会社, 305: 合同会社, 399: その他の設立登記法人, 401: 外国会社等, 499: その他。複数はカンマ区切り）")] = None,
    exist_flg: Annotated[Optional[bool], Field(description="法人活動情報の有無")] = None,
    prefecture: Annotated[Optional[str], Field(description="都道府県コード（JIS X 0401の2桁）")] = None,
    city: Annotated[Optional[str], Field(description="市区町村コード（JIS X 0402の3桁）")] = None,
    address: Annotated[Optional[str], Field(description="住所（フリーテキスト）")] = None,
    industry: Annotated[Optional[str], Field(description="業種（フリーテキストまたはコード）")] = None,
    business_item: Annotated[Optional[str], Field(description="営業品目コード（GEPS）。例: 101, 206。複数はカンマ区切り")] = None,
    founded_year: Annotated[Optional[str], Field(description="創業年・設立年（カンマ区切り可）")] = None,
    sales_area: Annotated[Optional[str], Field(description="営業エリア（地域対応表のgBizINFOマスターコード。カンマ区切り可）")] = None,
    # 資格
    unified_qualification: Annotated[Optional[str], Field(description="全省庁統一資格の資格等級（従来型）。A,B,C,D をカンマ区切りで指定")] = None,
    unified_qualification_sub01: Annotated[Optional[str], Field(description="資格等級(物品の製造)：A,B,C,D をカンマ区切りで指定")] = None,
    unified_qualification_sub02: Annotated[Optional[str], Field(description="資格等級(物品の販売)：A,B,C,D をカンマ区切りで指定")] = None,
    unified_qualification_sub03: Annotated[Optional[str], Field(description="資格等級(役務の提供等)：A,B,C,D をカンマ区切りで指定")] = None,
    unified_qualification_sub04: Annotated[Optional[str], Field(description="資格等級(物品の買受け)：A,B,C,D をカンマ区切りで指定")] = None,
    # 数値範囲
    net_sales_from: Annotated[Optional[int], Field(description="売上高（以上）")] = None,
    net_sales_to: Annotated[Optional[int], Field(description="売上高（以下）")] = None,
    net_income_loss_from: Annotated[Optional[int], Field(description="当期純利益又は当期純損失（以上）")] = None,
    net_income_loss_to: Annotated[Optional[int], Field(description="当期純利益又は当期純損失（以下）")] = None,
    total_assets_from: Annotated[Optional[int], Field(description="総資産額（以上）")] = None,
    total_assets_to: Annotated[Optional[int], Field(description="総資産額（以下）")] = None,
    operating_revenue1_from: Annotated[Optional[int], Field(description="営業収益（以上）")] = None,
    operating_revenue1_to: Annotated[Optional[int], Field(description="営業収益（以下）")] = None,
    operating_revenue2_from: Annotated[Optional[int], Field(description="営業収入（以上）")] = None,
    operating_revenue2_to: Annotated[Optional[int], Field(description="営業収入（以下）")] = None,
    ordinary_income_loss_from: Annotated[Optional[int], Field(description="経常利益又は経常損失（以上）")] = None,
    ordinary_income_loss_to: Annotated[Optional[int], Field(description="経常利益又は経常損失（以下）")] = None,
    ordinary_income_from: Annotated[Optional[int], Field(description="経常収益（以上）")] = None,
    ordinary_income_to: Annotated[Optional[int], Field(description="経常収益（以下）")] = None,
    capital_stock_from: Annotated[Optional[int], Field(description="資本金（下限）")] = None,
    capital_stock_to: Annotated[Optional[int], Field(description="資本金（上限）")] = None,
    employee_number_from: Annotated[Optional[int], Field(description="従業員数（下限）")] = None,
    employee_number_to: Annotated[Optional[int], Field(description="従業員数（上限）")] = None,
    establishment_from: Annotated[Optional[str], Field(description="設立日（下限, YYYY-MM-DD）")] = None,
    establishment_to: Annotated[Optional[str], Field(description="設立日（上限, YYYY-MM-DD）")] = None,
    # 追加フィルタ
    name_major_shareholders: Annotated[Optional[str], Field(description="主要株主名")] = None,
    average_continuous_service_years: Annotated[Optional[str], Field(description="平均継続勤務年数")] = None,
    average_age: Annotated[Optional[str], Field(description="平均年齢")] = None,
    month_average_predetermined_overtime_hours: Annotated[Optional[str], Field(description="月平均所定外労働時間")] = None,
    female_workers_proportion: Annotated[Optional[str], Field(description="女性労働者の割合")] = None,
    year: Annotated[Optional[str], Field(description="年度")] = None,
    ministry: Annotated[Optional[str], Field(description="省庁名")] = None,
    source: Annotated[Optional[str], Field(description="情報源")] = None,
    # ページング
    page: Annotated[int, Field(description="開始位置(1始まり)", ge=1)] = 1,
    limit: Annotated[int, Field(description="取得件数", ge=1)] = 1000,
) -> Dict[str, Any]:
    """gBizINFO を複合条件で検索します（Swaggerの検索クエリを個別パラメータで受け付け）。"""
    # パラメータをCompanySearchQueryで検証・正規化
    params = locals().copy()
    query = CompanySearchQuery(**params)
    
    page_result = service.search_companies(**query.model_dump(exclude_none=True))
    return {
        "items": [i.model_dump() for i in page_result.items],
        "total": page_result.total,
        "from": page_result.from_,
        "size": page_result.size,
    }


def _corporate_arg(arg: Optional[str]) -> str:
    if arg is None:
        raise InputValidationError("corporateNumber is required")
    return validate_corporate_number(arg)


@mcp.tool(name="get_basic_info", description="法人番号で基本情報を取得します。")
def get_basic_info(
    corporateNumber: Annotated[Optional[str], Field(description="法人番号（13桁）")] = None  # noqa: N803
) -> Any:
    return service.get_basic_info(_corporate_arg(corporateNumber))


@mcp.tool(name="get_certification", description="法人番号で届出・認定情報を取得します。")
def get_certification(
    corporateNumber: Annotated[Optional[str], Field(description="法人番号（13桁）")] = None  # noqa: N803
) -> Any:
    return service.get_certification(_corporate_arg(corporateNumber))


@mcp.tool(name="get_commendation", description="法人番号で表彰情報を取得します。")
def get_commendation(
    corporateNumber: Annotated[Optional[str], Field(description="法人番号（13桁）")] = None  # noqa: N803
) -> Any:
    return service.get_commendation(_corporate_arg(corporateNumber))


@mcp.tool(name="get_finance", description="法人番号で財務情報を取得します。")
def get_finance(
    corporateNumber: Annotated[Optional[str], Field(description="法人番号（13桁）")] = None  # noqa: N803
) -> Any:
    return service.get_finance(_corporate_arg(corporateNumber))


@mcp.tool(name="get_patent", description="法人番号で特許情報を取得します。")
def get_patent(
    corporateNumber: Annotated[Optional[str], Field(description="法人番号（13桁）")] = None  # noqa: N803
) -> Any:
    return service.get_patent(_corporate_arg(corporateNumber))


@mcp.tool(name="get_procurement", description="法人番号で調達情報を取得します。")
def get_procurement(
    corporateNumber: Annotated[Optional[str], Field(description="法人番号（13桁）")] = None  # noqa: N803
) -> Any:
    return service.get_procurement(_corporate_arg(corporateNumber))


@mcp.tool(name="get_subsidy", description="法人番号で補助金情報を取得します。")
def get_subsidy(
    corporateNumber: Annotated[Optional[str], Field(description="法人番号（13桁）")] = None  # noqa: N803
) -> Any:
    return service.get_subsidy(_corporate_arg(corporateNumber))


@mcp.tool(name="get_workplace", description="法人番号で職場情報を取得します。")
def get_workplace(
    corporateNumber: Annotated[Optional[str], Field(description="法人番号（13桁）")] = None  # noqa: N803
) -> Any:
    return service.get_workplace(_corporate_arg(corporateNumber))


def main() -> None:
    """Console-script entrypoint to run the FastMCP server."""
    mcp.run()


if __name__ == "__main__":
    main()
