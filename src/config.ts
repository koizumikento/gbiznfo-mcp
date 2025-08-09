import "dotenv/config";

export type AppConfig = {
  gbizinfoApiToken: string;
  requestTimeoutMs: number;
  gbizinfoBaseUrl: string;
  retries: number;
};

function loadConfig(): AppConfig {
  const gbizinfoApiToken = process.env.GBIZINFO_API_TOKEN;
  if (!gbizinfoApiToken) {
    throw new Error(
      "GBIZINFO_API_TOKEN is required. Set it in .env (see .env.example)."
    );
  }

  const requestTimeoutMs = Number(process.env.REQUEST_TIMEOUT_MS ?? 15000);
  const retries = Number(process.env.GBIZINFO_RETRIES ?? 1);
  const gbizinfoBaseUrl =
    process.env.GBIZINFO_BASE_URL?.trim() || "https://info.gbiz.go.jp/hojin/v1/hojin";

  return { gbizinfoApiToken, requestTimeoutMs, gbizinfoBaseUrl, retries };
}

export const config: AppConfig = loadConfig();


