from __future__ import annotations

from typing import Any, Dict, List, Optional

from ..config import settings
from ..model.company import Company
from ..model.hojin_info import HojinInfoResponse
from ..model.pagination import PaginatedResult
from ..model.update_page import UpdateInfoPage
from .adapters.gbizinfo_adapter import map_api_company_to_domain
from .http import HttpClient


class ApiCommunicationError(Exception):
    pass


class GBizInfoService:
    def __init__(self, http_client: Optional[HttpClient] = None) -> None:
        self._http = http_client or HttpClient()
        self._base_url = settings.gbizinfo_base_url.rstrip("/")
        self._update_base_url = f"{self._base_url}/updateInfo"

    def _build_detail_url(self, corporate_number: str, sub_path: Optional[str] = None) -> str:
        base = f"{self._base_url}/{corporate_number}"
        return f"{base}/{sub_path}" if sub_path else base

    def get_basic_info(self, corporate_number: str) -> Any:
        url = self._build_detail_url(corporate_number)
        try:
            res = self._http.request(url)
            if isinstance(res, dict):
                return HojinInfoResponse.model_validate(res)
            return res
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e

    def get_certification(self, corporate_number: str) -> Any:
        url = self._build_detail_url(corporate_number, "certification")
        try:
            res = self._http.request(url)
            if isinstance(res, dict):
                return HojinInfoResponse.model_validate(res)
            return res
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e

    def get_commendation(self, corporate_number: str) -> Any:
        url = self._build_detail_url(corporate_number, "commendation")
        try:
            res = self._http.request(url)
            if isinstance(res, dict):
                return HojinInfoResponse.model_validate(res)
            return res
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e

    def get_finance(self, corporate_number: str) -> Any:
        url = self._build_detail_url(corporate_number, "finance")
        try:
            res = self._http.request(url)
            if isinstance(res, dict):
                return HojinInfoResponse.model_validate(res)
            return res
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e

    def get_patent(self, corporate_number: str) -> Any:
        url = self._build_detail_url(corporate_number, "patent")
        try:
            res = self._http.request(url)
            if isinstance(res, dict):
                return HojinInfoResponse.model_validate(res)
            return res
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e

    def get_procurement(self, corporate_number: str) -> Any:
        url = self._build_detail_url(corporate_number, "procurement")
        try:
            res = self._http.request(url)
            if isinstance(res, dict):
                return HojinInfoResponse.model_validate(res)
            return res
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e

    def get_subsidy(self, corporate_number: str) -> Any:
        url = self._build_detail_url(corporate_number, "subsidy")
        try:
            res = self._http.request(url)
            if isinstance(res, dict):
                return HojinInfoResponse.model_validate(res)
            return res
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e

    def get_workplace(self, corporate_number: str) -> Any:
        url = self._build_detail_url(corporate_number, "workplace")
        try:
            res = self._http.request(url)
            if isinstance(res, dict):
                return HojinInfoResponse.model_validate(res)
            return res
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e

    # Period-specified update info
    def _build_update_url(self, sub_path: Optional[str] = None) -> str:
        return f"{self._update_base_url}/{sub_path}" if sub_path else self._update_base_url

    def get_update_info(self, *, from_: str, to: str, page: int = 1) -> UpdateInfoPage:
        url = self._build_update_url()
        query = {
            "from": from_,
            "to": to,
            "page": str(page),
        }
        url = url + "?" + "&".join(f"{k}={v}" for k, v in query.items())
        try:
            res = self._http.request(url)
            items: list[dict] = []
            if isinstance(res, dict):
                raw_items = res.get("hojin-infos") or []
                if isinstance(raw_items, list):
                    items = [i for i in raw_items if isinstance(i, dict)]
            return UpdateInfoPage(
                items=[map_api_company_to_domain(i) for i in items],
                pageNumber=int((res or {}).get("pageNumber") or page),
                totalCount=int((res or {}).get("totalCount") or len(items)),
                totalPage=int((res or {}).get("totalPage") or 1),
            )
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e

    def get_update_info_certification(
        self, *, from_: str, to: str, page: int = 1
    ) -> UpdateInfoPage:
        return self._get_update_info_category("certification", from_=from_, to=to, page=page)

    def get_update_info_commendation(self, *, from_: str, to: str, page: int = 1) -> UpdateInfoPage:
        return self._get_update_info_category("commendation", from_=from_, to=to, page=page)

    def get_update_info_finance(self, *, from_: str, to: str, page: int = 1) -> UpdateInfoPage:
        return self._get_update_info_category("finance", from_=from_, to=to, page=page)

    def get_update_info_patent(self, *, from_: str, to: str, page: int = 1) -> UpdateInfoPage:
        return self._get_update_info_category("patent", from_=from_, to=to, page=page)

    def get_update_info_procurement(self, *, from_: str, to: str, page: int = 1) -> UpdateInfoPage:
        return self._get_update_info_category("procurement", from_=from_, to=to, page=page)

    def get_update_info_subsidy(self, *, from_: str, to: str, page: int = 1) -> UpdateInfoPage:
        return self._get_update_info_category("subsidy", from_=from_, to=to, page=page)

    def get_update_info_workplace(self, *, from_: str, to: str, page: int = 1) -> UpdateInfoPage:
        return self._get_update_info_category("workplace", from_=from_, to=to, page=page)

    def _get_update_info_category(
        self, category: str, *, from_: str, to: str, page: int
    ) -> UpdateInfoPage:
        url = self._build_update_url(category)
        query = {
            "from": from_,
            "to": to,
            "page": str(page),
        }
        url = url + "?" + "&".join(f"{k}={v}" for k, v in query.items())
        try:
            res = self._http.request(url)
            items: list[dict] = []
            if isinstance(res, dict):
                raw_items = res.get("hojin-infos") or []
                if isinstance(raw_items, list):
                    items = [i for i in raw_items if isinstance(i, dict)]
            return UpdateInfoPage(
                items=[map_api_company_to_domain(i) for i in items],
                pageNumber=int((res or {}).get("pageNumber") or page),
                totalCount=int((res or {}).get("totalCount") or len(items)),
                totalPage=int((res or {}).get("totalPage") or 1),
            )
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e

    def search_companies(
        self,
        *,
        name: Optional[str] = None,
        corporate_number: Optional[str] = None,
        corporate_type: Optional[str] = None,
        exist_flg: Optional[bool] = None,
        prefecture: Optional[str] = None,
        city: Optional[str] = None,
        address: Optional[str] = None,
        industry: Optional[str] = None,
        business_item: Optional[str] = None,
        founded_year: Optional[str] = None,
        sales_area: Optional[str] = None,
        unified_qualification: Optional[str] = None,
        unified_qualification_sub01: Optional[str] = None,
        unified_qualification_sub02: Optional[str] = None,
        unified_qualification_sub03: Optional[str] = None,
        unified_qualification_sub04: Optional[str] = None,
        net_sales_from: Optional[int] = None,
        net_sales_to: Optional[int] = None,
        net_income_loss_from: Optional[int] = None,
        net_income_loss_to: Optional[int] = None,
        total_assets_from: Optional[int] = None,
        total_assets_to: Optional[int] = None,
        operating_revenue1_from: Optional[int] = None,
        operating_revenue1_to: Optional[int] = None,
        operating_revenue2_from: Optional[int] = None,
        operating_revenue2_to: Optional[int] = None,
        ordinary_income_loss_from: Optional[int] = None,
        ordinary_income_loss_to: Optional[int] = None,
        ordinary_income_from: Optional[int] = None,
        ordinary_income_to: Optional[int] = None,
        capital_stock_from: Optional[int] = None,
        capital_stock_to: Optional[int] = None,
        employee_number_from: Optional[int] = None,
        employee_number_to: Optional[int] = None,
        establishment_from: Optional[str] = None,
        establishment_to: Optional[str] = None,
        # Additional filters per spec
        name_major_shareholders: Optional[str] = None,
        average_continuous_service_years: Optional[str] = None,
        average_age: Optional[str] = None,
        month_average_predetermined_overtime_hours: Optional[str] = None,
        female_workers_proportion: Optional[str] = None,
        year: Optional[str] = None,
        ministry: Optional[str] = None,
        source: Optional[str] = None,
        page: int = 1,
        limit: int = 1000,
    ) -> PaginatedResult[Company]:
        query: Dict[str, str] = {}
        if name:
            query["name"] = name
        if corporate_number:
            query["corporate_number"] = corporate_number
        if corporate_type:
            query["corporate_type"] = corporate_type
        if exist_flg is not None:
            query["exist_flg"] = "true" if exist_flg else "false"
        if prefecture:
            query["prefecture"] = prefecture
        if city:
            query["city"] = city
        if address:
            query["address"] = address
        if industry:
            query["industry"] = industry
        if business_item:
            query["business_item"] = business_item
        if founded_year:
            query["founded_year"] = founded_year
        if sales_area:
            query["sales_area"] = sales_area
        if unified_qualification:
            query["unified_qualification"] = unified_qualification
        if unified_qualification_sub01:
            query["unified_qualification_sub01"] = unified_qualification_sub01
        if unified_qualification_sub02:
            query["unified_qualification_sub02"] = unified_qualification_sub02
        if unified_qualification_sub03:
            query["unified_qualification_sub03"] = unified_qualification_sub03
        if unified_qualification_sub04:
            query["unified_qualification_sub04"] = unified_qualification_sub04
        if net_sales_from is not None:
            query["net_sales_summary_of_business_results_from"] = str(net_sales_from)
        if net_sales_to is not None:
            query["net_sales_summary_of_business_results_to"] = str(net_sales_to)
        if net_income_loss_from is not None:
            query["net_income_loss_summary_of_business_results_from"] = str(net_income_loss_from)
        if net_income_loss_to is not None:
            query["net_income_loss_summary_of_business_results_to"] = str(net_income_loss_to)
        if total_assets_from is not None:
            query["total_assets_summary_of_business_results_from"] = str(total_assets_from)
        if total_assets_to is not None:
            query["total_assets_summary_of_business_results_to"] = str(total_assets_to)
        if operating_revenue1_from is not None:
            query["operating_revenue1_summary_of_business_results_from"] = str(
                operating_revenue1_from
            )
        if operating_revenue1_to is not None:
            query["operating_revenue1_summary_of_business_results_to"] = str(operating_revenue1_to)
        if operating_revenue2_from is not None:
            query["operating_revenue2_summary_of_business_results_from"] = str(
                operating_revenue2_from
            )
        if operating_revenue2_to is not None:
            query["operating_revenue2_summary_of_business_results_to"] = str(operating_revenue2_to)
        if ordinary_income_loss_from is not None:
            query["ordinary_income_loss_summary_of_business_results_from"] = str(
                ordinary_income_loss_from
            )
        if ordinary_income_loss_to is not None:
            query["ordinary_income_loss_summary_of_business_results_to"] = str(
                ordinary_income_loss_to
            )
        if ordinary_income_from is not None:
            query["ordinary_income_summary_of_business_results_from"] = str(ordinary_income_from)
        if ordinary_income_to is not None:
            query["ordinary_income_summary_of_business_results_to"] = str(ordinary_income_to)
        if capital_stock_from is not None:
            query["capital_stock_from"] = str(capital_stock_from)
        if capital_stock_to is not None:
            query["capital_stock_to"] = str(capital_stock_to)
        if employee_number_from is not None:
            query["employee_number_from"] = str(employee_number_from)
        if employee_number_to is not None:
            query["employee_number_to"] = str(employee_number_to)
        if establishment_from:
            query["establishment_from"] = establishment_from
        if establishment_to:
            query["establishment_to"] = establishment_to
        if name_major_shareholders:
            query["name_major_shareholders"] = name_major_shareholders
        if average_continuous_service_years:
            query["average_continuous_service_years"] = average_continuous_service_years
        if average_age:
            query["average_age"] = average_age
        if month_average_predetermined_overtime_hours:
            query["month_average_predetermined_overtime_hours"] = (
                month_average_predetermined_overtime_hours
            )
        if female_workers_proportion:
            query["female_workers_proportion"] = female_workers_proportion
        if year:
            query["year"] = year
        if ministry:
            query["ministry"] = ministry
        if source:
            query["source"] = source

        query["page"] = str(page)
        query["limit"] = str(limit)

        url = f"{self._base_url}?" + "&".join(f"{k}={v}" for k, v in query.items())

        try:
            res = self._http.request(url)
            items: List[dict] = []
            total: int = 0
            if isinstance(res, dict):
                raw_items = res.get("hojin-infos") or res.get("items") or res.get("results") or []
                if isinstance(raw_items, list):
                    items = [i for i in raw_items if isinstance(i, dict)]
                total = int(
                    res.get("total") or res.get("count") or res.get("total-count") or len(items)
                )
            return PaginatedResult[Company](
                items=[map_api_company_to_domain(i) for i in items],
                total=total,
                from_=page,
                size=limit,
            )
        except Exception as e:  # noqa: BLE001
            raise ApiCommunicationError(str(e)) from e
