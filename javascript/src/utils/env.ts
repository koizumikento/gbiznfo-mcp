import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function loadEnv(): void {
  // 1) 現在の作業ディレクトリから読み込み
  dotenv.config();

  if (process.env.GBIZINFO_API_TOKEN) return;

  // 2) 実行ファイル位置の1つ上（プロジェクトルート想定）から読み込み
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidate = path.resolve(here, "..", ".env");
  dotenv.config({ path: candidate });
}


