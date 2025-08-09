# gBizINFO MCP Scaffold

このプロジェクトは gBizINFO 情報提供API を MCP（Model-Controller-Presenter）で利用するための雛形です。

## 使い方
1. `.env` を作成し、`GBIZINFO_API_TOKEN` を設定
   - 任意: `GBIZINFO_BASE_URL`（既定: `https://info.gbiz.go.jp/hojin/v1`）
   - 認証ヘッダは `X-hojinInfo-api-token` が使用されます
2. OpenAPI スキーマを取得し `openapi/raw/gbizinfo-openapi.json` へ保存
3. YAML へ変換し `openapi/gbizinfo-openapi.yaml` へ保存
4. クライアント生成:
   ```sh
   npm run generate:client
   ```
   - 生成結果を `GbizinfoService` へ注入するには以下のいずれかを利用
     - 関数アダプタ: `createGbizinfoApiClientFromFunction(fn)`
     - OpenAPIアダプタ: `createGbizinfoApiClientFromOpenapi(client)`

### 利用例（ライブラリ）
```ts
import { GbizinfoService, GbizinfoApiClientImpl } from "gbixnfo-mcp";

const service = new GbizinfoService(undefined, new GbizinfoApiClientImpl(/* http */));
const page = await service.searchCompaniesByName("テスト", 1, 20);
```

### CLI の使い方
ビルド後、`npx` で以下のように実行可能です。

```sh
npx gbixnfo-mcp gbizinfo search "サンプル" 1 20
```

ローカルパッケージでの実行例:

```sh
npm run build
node dist/cli.js search "サンプル" 1 20
```

### OpenAPI 生成クライアントの注入
```ts
import { GbizinfoService, createGbizinfoApiClientFromOpenapi } from "gbixnfo-mcp";
import { DefaultApi } from "./src/clients/gbizinfo"; // 生成クライアントの型例

const openapi = new DefaultApi(/* ... */);
const apiClient = createGbizinfoApiClientFromOpenapi(openapi);
const service = new GbizinfoService(undefined, apiClient);
```
5. 開発起動:
   ```sh
   npm run dev
   ```

詳細な流れは `.cursor/rules` のルール（`gbizinfo-mcp-project` / `openapi-client` / `mcp-architecture` / `security-and-config`）を参照してください。


