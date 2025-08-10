# gbizinfo-mcp (Python)

- FastAPI + fastapi-mcp による MCP サーバー構成。
- 依存と実行は `uv` を推奨。

## 初期化（Windows PowerShell）

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
cd python
uv sync  # pyproject.toml の依存（fastapi, fastapi-mcp>=0.3.7 など）を解決
```

## サーバー起動

```powershell
cd python
uv run uvicorn gbizinfo_mcp.mcp_server:app --reload --host 0.0.0.0 --port 8000
```

## OpenAPI クライアント生成

```powershell
# ルートで実行
npm run generate:client:py
```

生成後、`python/clients/gbizinfo` にクライアントが出力されます。必要であれば `gbizinfo_mcp.services.gbizinfo_service.GBizInfoService` のコンストラクタに生成クライアントを渡すことで、HTTPフォールバックではなく生成クライアントが優先されます。
