from __future__ import annotations

from typing import Generic, List, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class PaginatedResult(BaseModel, Generic[T]):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    items: List[T]
    total: int
    from_: int
    size: int
