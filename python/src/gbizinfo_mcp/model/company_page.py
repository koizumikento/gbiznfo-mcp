from __future__ import annotations

from typing import List

from pydantic import BaseModel, ConfigDict, Field

from .company import Company


class CompanyPage(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, extra="ignore")

    items: List[Company]
    total: int
    from_: int = Field(alias="from")
    size: int
