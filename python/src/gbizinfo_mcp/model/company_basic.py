from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict


class CompanyBasic(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    corporate_number: str
    name: str
    address: Optional[str] = None
    prefecture: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
