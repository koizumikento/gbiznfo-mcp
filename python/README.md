# gbizinfo-mcp (Python)

- FastAPI + fastapi-mcp による MCP サーバー構成。
- 依存と実行は `uv` を推奨。
- OpenAPI ジェネレータは使用せず、`requests` + Pydantic による型安全実装。

## 前提: 環境変数

`.env` に gBizINFO API トークンを設定します。

```dotenv
GBIZINFO_API_TOKEN=xxxxxxxxxxxxxxxx
# 任意: ベースURL/タイムアウト/リトライ
# GBIZINFO_BASE_URL=https://info.gbiz.go.jp/hojin/v1/hojin
# REQUEST_TIMEOUT_SECONDS=10
# CONNECT_TIMEOUT_SECONDS=3
# HTTP_RETRIES=1
```

## 初期化（Windows PowerShell）

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
cd python
uv sync  # pyproject.toml の依存（fastapi, fastapi-mcp, requests, pydantic など）を解決
```

## サーバー起動

```powershell
cd python
uv run uvicorn gbizinfo_mcp.app:app --reload --host 0.0.0.0 --port 8000
```

## 提供 API（抜粋）

- `GET /api/companies?name=...&page=1&limit=20`: 企業名検索（ページング）
- `GET /api/companies/{corporate_number}`: 基本情報
- `GET /api/companies/{corporate_number}/certification`: 認定
- `GET /api/companies/{corporate_number}/commendation`: 表彰
- `GET /api/companies/{corporate_number}/finance`: 財務
- `GET /api/companies/{corporate_number}/patent`: 特許
- `GET /api/companies/{corporate_number}/procurement`: 調達
- `GET /api/companies/{corporate_number}/subsidy`: 補助金
- `GET /api/companies/{corporate_number}/workplace`: 職場
- `GET /api/updates?from=yyyyMMdd&to=yyyyMMdd&page=1`: 期間内の更新（基本）
- `GET /api/updates/{category}?from=yyyyMMdd&to=yyyyMMdd&page=1`: 期間内の更新（category: certification|commendation|finance|patent|procurement|subsidy|workplace）

注意

- `from`/`to` は `yyyyMMdd` 必須
- トークンは `.env` の `GBIZINFO_API_TOKEN`
