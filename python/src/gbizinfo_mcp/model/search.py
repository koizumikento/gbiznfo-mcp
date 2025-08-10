from __future__ import annotations

import re
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from ..utils.validation import validate_corporate_number


class CompanySearchQuery(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    # Basic filters
    name: Optional[str] = None
    corporate_number: Optional[str] = None
    corporate_type: Optional[str] = None  # カンマ区切り
    exist_flg: Optional[bool] = None
    prefecture: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    industry: Optional[str] = None
    business_item: Optional[str] = None  # カンマ区切り
    founded_year: Optional[str] = None  # カンマ区切り
    sales_area: Optional[str] = None  # カンマ区切り

    # Qualifications
    unified_qualification: Optional[str] = None
    unified_qualification_sub01: Optional[str] = None
    unified_qualification_sub02: Optional[str] = None
    unified_qualification_sub03: Optional[str] = None
    unified_qualification_sub04: Optional[str] = None

    # Ranges
    net_sales_from: Optional[int] = None
    net_sales_to: Optional[int] = None
    net_income_loss_from: Optional[int] = None
    net_income_loss_to: Optional[int] = None
    total_assets_from: Optional[int] = None
    total_assets_to: Optional[int] = None
    operating_revenue1_from: Optional[int] = None
    operating_revenue1_to: Optional[int] = None
    operating_revenue2_from: Optional[int] = None
    operating_revenue2_to: Optional[int] = None
    ordinary_income_loss_from: Optional[int] = None
    ordinary_income_loss_to: Optional[int] = None
    ordinary_income_from: Optional[int] = None
    ordinary_income_to: Optional[int] = None
    capital_stock_from: Optional[int] = None
    capital_stock_to: Optional[int] = None
    employee_number_from: Optional[int] = None
    employee_number_to: Optional[int] = None
    establishment_from: Optional[str] = None  # YYYY-MM-DD
    establishment_to: Optional[str] = None  # YYYY-MM-DD

    # Additional filters from spec
    name_major_shareholders: Optional[str] = None
    average_continuous_service_years: Optional[str] = None
    average_age: Optional[str] = None
    month_average_predetermined_overtime_hours: Optional[str] = None
    female_workers_proportion: Optional[str] = None
    year: Optional[str] = None
    ministry: Optional[str] = None
    source: Optional[str] = None

    # Pagination
    page: int = Field(default=1, ge=1, le=10)
    limit: int = Field(default=1000, ge=0, le=5000)

    # Patterns
    _csv_digits = re.compile(r"^[0-9]+(,[0-9]+)*$")
    _csv_ad = re.compile(r"^[ABCD](,[ABCD])*$")

    @field_validator(
        "net_sales_from",
        "net_sales_to",
        "net_income_loss_from",
        "net_income_loss_to",
        "total_assets_from",
        "total_assets_to",
        "operating_revenue1_from",
        "operating_revenue1_to",
        "operating_revenue2_from",
        "operating_revenue2_to",
        "ordinary_income_loss_from",
        "ordinary_income_loss_to",
        "ordinary_income_from",
        "ordinary_income_to",
        "capital_stock_from",
        "capital_stock_to",
        "employee_number_from",
        "employee_number_to",
    )
    @classmethod
    def _non_negative(cls, v: Optional[int]) -> Optional[int]:
        if v is None:
            return v
        if v < 0:
            raise ValueError("must be >= 0")
        return v

    @field_validator(
        "corporate_type",
        "business_item",
        "founded_year",
        "sales_area",
    )
    @classmethod
    def _csv_digits_validator(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        if not cls._csv_digits.fullmatch(v):
            raise ValueError("must be comma-separated digits")
        return v

    @field_validator(
        "unified_qualification",
        "unified_qualification_sub01",
        "unified_qualification_sub02",
        "unified_qualification_sub03",
        "unified_qualification_sub04",
    )
    @classmethod
    def _csv_ad_validator(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        if not cls._csv_ad.fullmatch(v):
            raise ValueError("must be comma-separated A-D")
        return v

    @field_validator("prefecture")
    @classmethod
    def _prefecture_jis(cls, v: Optional[str]) -> Optional[str]:
        # JIS X 0401 (2 digits) loosely enforce when numeric provided
        if v is None or v == "":
            return None
        if v.isdigit() and len(v) != 2:
            raise ValueError("prefecture must be 2 digits when numeric")
        return v

    @field_validator("city")
    @classmethod
    def _city_jis(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        if v.isdigit() and len(v) != 3:
            raise ValueError("city must be 3 digits when numeric")
        return v

    @field_validator("corporate_number")
    @classmethod
    def _corporate_number(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        return validate_corporate_number(v)

    @model_validator(mode="after")
    def _city_requires_prefecture(self) -> "CompanySearchQuery":
        if self.city and not self.prefecture:
            raise ValueError("city requires prefecture")
        return self
