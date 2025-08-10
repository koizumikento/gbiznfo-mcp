from __future__ import annotations

from typing import Any

from pydantic import RootModel


class RawJSON(RootModel[Any]):
    pass
