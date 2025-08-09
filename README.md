## gBizINFO MCP

gBizINFO 情報提供 API を TypeScript ライブラリおよび Model Context Protocol サーバーとして提供します。サービス層で gBizINFO を呼び出し、MCP では各種取得・検索機能をツールとして公開します。

### 要件
- Node.js 18+（`fetch` を使用）

## セットアップ
1. 依存関係をインストール
   ```sh
   npm i
   ```
2. `.env` をプロジェクトルートに作成し、以下を設定
   ```env
   GBIZINFO_API_TOKEN=あなたのAPIトークン
   # 任意（デフォルト: https://info.gbiz.go.jp/hojin/v1/hojin）
   GBIZINFO_BASE_URL=https://info.gbiz.go.jp/hojin/v1/hojin
   # 任意（ミリ秒, 既定 15000）
   REQUEST_TIMEOUT_MS=15000
   # 任意（リトライ回数, 既定 1）
   GBIZINFO_RETRIES=1
   ```

メモ:
- 認証ヘッダは仕様通り `X-hojinInfo-api-token` が自動付与されます（`src/services/http.ts`）。

## OpenAPI スキーマとクライアント生成（任意）
公式 Swagger UI からスキーマを取得し、必要に応じて TypeScript クライアントを生成できます。
1. Swagger UI から JSON を取得し `openapi/raw/gbizinfo-openapi.json` へ保存
2. YAML に変換し `openapi/gbizinfo-openapi.yaml` へ保存
3. クライアント生成
   ```sh
   npm run generate:client
   ```
   生成先: `src/clients/gbizinfo`

## ライブラリの使い方
`GbizinfoService` を直接利用できます。

```ts
import { GbizinfoService } from "gbixnfo-mcp";

const service = new GbizinfoService();

// 企業検索（複合条件）
const result = await service.searchCompanies({
  name: "テスト",
  prefecture: "東京都",
  page: 1,
  limit: 20,
});

// 法人番号で詳細取得
const basic = await service.getBasicInfo("0000000000000");
```

エクスポートは `src/index.ts` を参照（`GbizinfoService`, `HttpClient`, `presenters`, `models` など）。

## MCP サーバーの使い方
### ローカル実行（Cursor 連携）
1. ビルド
   ```sh
   npm run build
   ```
2. Cursor 設定（Settings → MCP → Add Server）
   - Type: Command
   - Command: `node`
   - Args: `dist/mcp/server.js`
   - Working Directory: プロジェクトルート
   - Environment: `GBIZINFO_API_TOKEN=...`

### npx で起動（公開後）
```sh
npx --yes -p gbixnfo-mcp gbizinfo-mcp
```

### 提供ツール
- `search`: 企業検索（複合条件: `name`/`corporateNumber`/`corporateType`/`existFlg`/`prefecture`/`city`/`address`/`industry`/`capitalStockFrom`/`capitalStockTo`/`employeeNumberFrom`/`employeeNumberTo`/`establishmentFrom`/`establishmentTo`/`from`/`size`）
- `get_basic_info`: 基本情報取得（法人番号）
- `get_certification`: 届出・認定情報
- `get_commendation`: 表彰情報
- `get_finance`: 財務情報
- `get_patent`: 特許情報
- `get_procurement`: 調達情報
- `get_subsidy`: 補助金情報
- `get_workplace`: 職場情報

## 開発
- ウォッチ実行（簡易ランナー）
  ```sh
  npm run dev
  ```
- ビルド
  ```sh
  npm run build
  ```

## 設計（MCP アーキテクチャ）
- エントリポイント: `src/index.ts`
- 環境/設定: `src/config.ts`
- MCP サーバー: `src/mcp/server.ts`
- 層構造:
  - Model: `src/model`
  - Controller: `src/controller`
  - Presenter: `src/presenter`
  - Service: `src/services`

セキュリティ/設定、OpenAPI クライアント生成の詳細は `.cursor/rules` のルール（`openapi-client` など）を参照してください。

