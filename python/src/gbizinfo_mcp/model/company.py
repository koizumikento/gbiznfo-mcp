from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict


class Company(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    corporate_number: str
    name: str
    prefecture: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    postal_code: Optional[str] = None
    industry: Optional[str] = None
