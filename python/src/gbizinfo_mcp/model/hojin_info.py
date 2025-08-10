from __future__ import annotations

from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ApiError(BaseModel):
    model_config = ConfigDict(extra="ignore")
    item: Optional[str] = None
    message: Optional[str] = None


class CertificationInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    category: Optional[str] = None
    date_of_approval: Optional[str] = None
    enterprise_scale: Optional[str] = None
    expiration_date: Optional[str] = None
    government_departments: Optional[str] = None
    target: Optional[str] = None
    title: Optional[str] = None


class CommendationInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    category: Optional[str] = None
    date_of_commendation: Optional[str] = None
    government_departments: Optional[str] = None
    target: Optional[str] = None
    title: Optional[str] = None


class MajorShareholders(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name_major_shareholders: Optional[str] = None
    shareholding_ratio: Optional[float] = None


class ManagementIndex(BaseModel):
    model_config = ConfigDict(extra="ignore")
    capital_stock_summary_of_business_results: Optional[int] = None
    capital_stock_summary_of_business_results_unit_ref: Optional[str] = None
    gross_operating_revenue_summary_of_business_results: Optional[int] = None
    gross_operating_revenue_summary_of_business_results_unit_ref: Optional[str] = None
    net_assets_summary_of_business_results: Optional[int] = None
    net_assets_summary_of_business_results_unit_ref: Optional[str] = None
    net_income_loss_summary_of_business_results: Optional[int] = None
    net_income_loss_summary_of_business_results_unit_ref: Optional[str] = None
    net_premiums_written_summary_of_business_results_ins: Optional[int] = None
    net_premiums_written_summary_of_business_results_ins_unit_ref: Optional[str] = None
    net_sales_summary_of_business_results: Optional[int] = None
    net_sales_summary_of_business_results_unit_ref: Optional[str] = None
    number_of_employees: Optional[int] = None
    number_of_employees_unit_ref: Optional[str] = None
    operating_revenue1_summary_of_business_results: Optional[int] = None
    operating_revenue1_summary_of_business_results_unit_ref: Optional[str] = None
    operating_revenue2_summary_of_business_results: Optional[int] = None
    operating_revenue2_summary_of_business_results_unit_ref: Optional[str] = None
    ordinary_income_loss_summary_of_business_results: Optional[int] = None
    ordinary_income_loss_summary_of_business_results_unit_ref: Optional[str] = None
    ordinary_income_summary_of_business_results: Optional[int] = None
    ordinary_income_summary_of_business_results_unit_ref: Optional[str] = None
    period: Optional[str] = None
    total_assets_summary_of_business_results: Optional[int] = None
    total_assets_summary_of_business_results_unit_ref: Optional[str] = None


class Finance(BaseModel):
    model_config = ConfigDict(extra="ignore")
    accounting_standards: Optional[str] = None
    fiscal_year_cover_page: Optional[str] = None
    major_shareholders: Optional[List[MajorShareholders]] = None
    management_index: Optional[List[ManagementIndex]] = None


class PatentInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    application_date: Optional[str] = None
    application_number: Optional[str] = None
    classifications: Optional[List[Dict[str, str]]] = None
    patent_type: Optional[str] = None
    title: Optional[str] = None


class ProcurementInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    amount: Optional[int] = None
    date_of_order: Optional[str] = None
    government_departments: Optional[str] = None
    joint_signatures: Optional[List[str]] = None
    title: Optional[str] = None


class SubsidyInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    amount: Optional[str] = None
    date_of_approval: Optional[str] = None
    government_departments: Optional[str] = None
    joint_signatures: Optional[List[str]] = None
    note: Optional[str] = None
    subsidy_resource: Optional[str] = None
    target: Optional[str] = None
    title: Optional[str] = None


class WomenActivityInfos(BaseModel):
    model_config = ConfigDict(extra="ignore")
    female_share_of_manager: Optional[int] = None
    female_share_of_officers: Optional[int] = None
    female_workers_proportion: Optional[float] = None
    female_workers_proportion_type: Optional[str] = None
    gender_total_of_manager: Optional[int] = None
    gender_total_of_officers: Optional[int] = None


class CompatibilityOfChildcareAndWork(BaseModel):
    model_config = ConfigDict(extra="ignore")
    maternity_leave_acquisition_num: Optional[int] = None
    number_of_maternity_leave: Optional[int] = None
    number_of_paternity_leave: Optional[int] = None
    paternity_leave_acquisition_num: Optional[int] = None


class WorkplaceBaseInfos(BaseModel):
    model_config = ConfigDict(extra="ignore")
    average_age: Optional[float] = None
    average_continuous_service_years: Optional[float] = None
    average_continuous_service_years_Female: Optional[float] = None  # noqa: N815 (API naming)
    average_continuous_service_years_Male: Optional[float] = None  # noqa: N815 (API naming)
    average_continuous_service_years_type: Optional[str] = None
    month_average_predetermined_overtime_hours: Optional[float] = None


class WorkplaceInfoBean(BaseModel):
    model_config = ConfigDict(extra="ignore")
    base_infos: Optional[WorkplaceBaseInfos] = None
    compatibility_of_childcare_and_work: Optional[CompatibilityOfChildcareAndWork] = None
    women_activity_infos: Optional[WomenActivityInfos] = None


class HojinInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")

    business_items: Optional[List[str]] = None
    business_summary: Optional[str] = None
    capital_stock: Optional[int] = None
    certification: Optional[List[CertificationInfo]] = None
    close_cause: Optional[str] = None
    close_date: Optional[str] = None
    commendation: Optional[List[CommendationInfo]] = None
    company_size_female: Optional[int] = None
    company_size_male: Optional[int] = None
    company_url: Optional[str] = None
    corporate_number: Optional[str] = None
    date_of_establishment: Optional[str] = None
    employee_number: Optional[int] = None
    finance: Optional[Finance] = None
    founding_year: Optional[int] = None
    kana: Optional[str] = None
    location: Optional[str] = None
    name: Optional[str] = None
    name_en: Optional[str] = None
    number_of_activity: Optional[str] = None
    patent: Optional[List[PatentInfo]] = None
    postal_code: Optional[str] = None
    procurement: Optional[List[ProcurementInfo]] = None
    qualification_grade: Optional[str] = None
    representative_name: Optional[str] = None
    representative_position: Optional[str] = None
    status: Optional[str] = None
    subsidy: Optional[List[SubsidyInfo]] = None
    update_date: Optional[str] = None
    workplace_info: Optional[WorkplaceInfoBean] = None


class HojinInfoResponse(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    errors: Optional[List[ApiError]] = None
    hojin_infos: Optional[List[HojinInfo]] = Field(default=None, alias="hojin-infos")
    id: Optional[str] = None
    message: Optional[str] = None
