# gBizINFO MCP Scaffold

このプロジェクトは gBizINFO 情報提供API を Model Context Protocol サーバーとして提供する雛形です。

## セットアップ
1. `.env` を作成し、`GBIZINFO_API_TOKEN` を設定
   - 任意: `GBIZINFO_BASE_URL`（既定: `https://info.gbiz.go.jp/hojin/v1/hojin`）
   - 認証ヘッダは `X-hojinInfo-api-token` が使用されます
2. OpenAPI スキーマを取得し `openapi/raw/gbizinfo-openapi.json` へ保存
3. YAML へ変換し `openapi/gbizinfo-openapi.yaml` へ保存
4. クライアント生成（任意）:
   ```sh
   npm run generate:client
   ```

### ライブラリ利用例
```ts
import { GbizinfoService } from "gbixnfo-mcp";

const service = new GbizinfoService();
const page = await service.searchCompaniesByName("テスト", 1, 20);
```

### MCP サーバーの使い方（ローカル）
- ビルド:
  ```sh
  npm run build
  ```
- Cursor 設定（Settings → MCP → Add Server）
  - Type: Command
  - Command: `node`
  - Args: `dist/mcp/server.js`
  - Working Directory: プロジェクトルート
  - Environment: `GBIZINFO_API_TOKEN=...`

### MCP サーバーの使い方（npm 公開後に npx で起動）
```sh
npx --yes -p gbixnfo-mcp gbizinfo-mcp
```

### 提供ツール（主要）
- `search_companies`: 企業名で検索
- `search`: 複合条件検索（name/corporateNumber/corporateType/existFlg/prefecture/city/address/industry/capitalStockFrom/To/employeeNumberFrom/To/establishmentFrom/To/from/size）
- `get_basic_info`, `get_certification`, `get_commendation`, `get_finance`, `get_patent`, `get_procurement`, `get_subsidy`, `get_workplace`

### 開発起動
```sh
npm run dev
```

詳細は `.cursor/rules` のルール（`gbizinfo-mcp-project` / `openapi-client` / `mcp-architecture` / `security-and-config`）を参照してください。


