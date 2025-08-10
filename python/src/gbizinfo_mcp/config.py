from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings

AUTH_HEADER_NAME = "X-hojinInfo-api-token"


class Settings(BaseSettings):
    gbizinfo_api_token: str = Field(alias="GBIZINFO_API_TOKEN")
    gbizinfo_base_url: str = Field(
        default="https://info.gbiz.go.jp/hojin/v1/hojin",
        alias="GBIZINFO_BASE_URL",
    )
    request_timeout_seconds: float = Field(default=10.0, alias="REQUEST_TIMEOUT_SECONDS")
    connect_timeout_seconds: float = Field(default=3.0, alias="CONNECT_TIMEOUT_SECONDS")
    retries: int = Field(default=1, alias="HTTP_RETRIES")
    user_agent: str = Field(default="gbixnfo-mcp/0.1 (+https://info.gbiz.go.jp/)")
    debug_http: bool = Field(default=False, alias="DEBUG_HTTP")
    rate_limit_per_sec: float | None = Field(default=None, alias="RATE_LIMIT_PER_SEC")

    class Config:
        populate_by_name = True
        env_file = ".env"
        case_sensitive = False


settings = Settings()  # will validate at import time
