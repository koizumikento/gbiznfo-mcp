from __future__ import annotations

from typing import Any, Dict

from ...model.company import Company
from ...utils.normalize import to_optional_str, to_str_or_empty


def map_api_company_to_domain(item: Dict[str, Any]) -> Company:
    return Company(
        corporate_number=to_str_or_empty(
            item.get("corporate_number") or item.get("corporateNumber")
        ),
        name=to_str_or_empty(item.get("name") or item.get("name_jp") or item.get("nameJp")),
        prefecture=to_optional_str(
            item.get("prefecture_name") or item.get("prefecture") or item.get("prefectureName")
        ),
        city=to_optional_str(item.get("city_name") or item.get("city") or item.get("cityName")),
        address=to_optional_str(item.get("address") or item.get("street") or item.get("location")),
        postal_code=to_optional_str(
            item.get("postal_code") or item.get("postalCode") or item.get("zip")
        ),
        industry=to_optional_str(item.get("sic") or item.get("industry")),
    )
