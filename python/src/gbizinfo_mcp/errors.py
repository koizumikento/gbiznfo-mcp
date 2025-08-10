from __future__ import annotations

from typing import Any, Dict, Optional


class InputValidationError(Exception):
    def __init__(self, message: str, *, field: Optional[str] = None) -> None:
        super().__init__(message)
        self.field = field


class DomainError(Exception):
    pass


class ApiCommunicationError(Exception):
    pass


def error_payload(message: str, *, id: Optional[str] = None, details: Any = None) -> Dict[str, Any]:
    payload: Dict[str, Any] = {"message": message}
    if id is not None:
        payload["id"] = id
    if details is not None:
        payload["errors"] = details
    return payload
