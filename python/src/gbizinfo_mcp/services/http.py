from __future__ import annotations

import json
import logging
import threading
import time
from dataclasses import dataclass
from typing import Any, Dict, Mapping, Optional, Tuple

import requests
from requests import Response
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from ..config import AUTH_HEADER_NAME, settings


@dataclass
class HttpRequestOptions:
    method: str = "GET"
    headers: Optional[Mapping[str, str]] = None
    body: Optional[Any] = None
    timeout: Optional[Tuple[float, float]] = None  # (connect, read)


class ApiServerError(Exception):
    def __init__(
        self, status_code: int, message: str, *, id: Optional[str] = None, details: Any = None
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.id = id
        self.details = details


class HttpClient:
    def __init__(self, *, debug: bool = False) -> None:
        self._debug = debug or settings.debug_http
        self._session = requests.Session()
        self._lock = threading.Lock()
        self._last_request_ts: float | None = None

        retry = Retry(
            total=settings.retries,
            backoff_factor=0.5,
            status_forcelist=(500, 502, 503, 504),
            allowed_methods=("GET", "POST", "PUT", "PATCH", "DELETE"),
            raise_on_status=False,
        )
        adapter = HTTPAdapter(max_retries=retry)
        self._session.mount("http://", adapter)
        self._session.mount("https://", adapter)

    def request(self, url: str, options: Optional[HttpRequestOptions] = None) -> Any:
        if options is None:
            options = HttpRequestOptions()

        method = options.method or "GET"
        connect_timeout = settings.connect_timeout_seconds
        read_timeout = settings.request_timeout_seconds
        timeout = options.timeout or (connect_timeout, read_timeout)

        headers: Dict[str, str] = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": settings.user_agent,
            AUTH_HEADER_NAME: settings.gbizinfo_api_token,
        }
        if options.headers:
            headers.update(dict(options.headers))

        data = None
        if options.body is not None:
            data = json.dumps(options.body, ensure_ascii=False)

        # naive rate limiting (per-process)
        if settings.rate_limit_per_sec:
            with self._lock:
                now = time.perf_counter()
                if self._last_request_ts is not None:
                    min_interval = 1.0 / float(settings.rate_limit_per_sec)
                    elapsed = now - self._last_request_ts
                    if elapsed < min_interval:
                        time.sleep(min_interval - elapsed)
                self._last_request_ts = time.perf_counter()

        if self._debug:
            logging.getLogger(__name__).error(
                "http_request %s %s headers=%s bodyBytes=%s",
                method,
                url,
                _redact_headers(headers),
                len(data.encode("utf-8")) if isinstance(data, str) else 0,
            )

        response: Response = self._session.request(
            method=method,
            url=url,
            headers=headers,
            data=data,
            timeout=timeout,
        )

        content_type = (response.headers.get("content-type") or "").lower()
        text = response.text or ""

        if not response.ok:
            message = f"HTTP {response.status_code}"
            err_id: Optional[str] = None
            details: Any = None
            if content_type.startswith("application/json"):
                try:
                    payload = response.json()
                    if isinstance(payload, dict):
                        if payload.get("message"):
                            message = str(payload["message"])  # type: ignore[index]
                        if payload.get("id"):
                            err_id = str(payload["id"])  # type: ignore[index]
                        if payload.get("errors"):
                            details = payload.get("errors")
                except ValueError:
                    # ignore invalid JSON
                    pass
            else:
                if text:
                    message = f"{message}: {text[:500]}"
            if self._debug:
                logging.getLogger(__name__).error(
                    "http_response_error %s url=%s status=%s id=%s preview=%s",
                    message,
                    url,
                    response.status_code,
                    err_id,
                    (text[:500] if text else ""),
                )

            raise ApiServerError(response.status_code, message, id=err_id, details=details)

        if content_type.startswith("application/json"):
            if self._debug:
                logging.getLogger(__name__).error(
                    "http_response_ok status=%s url=%s contentType=%s preview=%s",
                    response.status_code,
                    url,
                    content_type,
                    (text[:500] if text else ""),
                )
            return response.json() if text else None
        return text


def _redact_headers(headers: Mapping[str, str]) -> Dict[str, str]:
    clone = dict(headers)
    if AUTH_HEADER_NAME in clone:
        clone[AUTH_HEADER_NAME] = "<redacted>"
    return clone
