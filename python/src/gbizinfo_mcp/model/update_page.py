from __future__ import annotations

from typing import List

from pydantic import BaseModel, ConfigDict

from .company import Company


class UpdateInfoPage(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    items: List[Company]
    pageNumber: int  # noqa: N815 (API naming)
    totalCount: int  # noqa: N815 (API naming)
    totalPage: int  # noqa: N815 (API naming)
