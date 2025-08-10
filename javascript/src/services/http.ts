import { config } from "../config.js";
import { ApiServerError } from "../errors.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  retries?: number;
}

const AUTH_HEADER_NAME = "X-hojinInfo-api-token"; // Swagger UI（v3 api-docs）の表記に厳密一致

export class HttpClient {
  private readonly debug: boolean;

  constructor(options?: { debug?: boolean }) {
    this.debug = Boolean(options?.debug);
  }

  async request<T>(url: string, options: HttpRequestOptions = {}): Promise<T> {
    const method = options.method ?? "GET";
    const timeoutMs = options.timeoutMs ?? config.requestTimeoutMs;
    const retries = options.retries ?? config.retries ?? 1;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "gbizinfo-mcp/0.1 (+https://info.gbiz.go.jp/)",
      ...(options.headers ?? {}),
      [AUTH_HEADER_NAME]: config.gbizinfoApiToken,
    };

    const body = options.body ? JSON.stringify(options.body) : undefined;

    const redactHeaders = (h: Record<string, string>) => {
      const clone: Record<string, string> = { ...h };
      if (clone[AUTH_HEADER_NAME]) clone[AUTH_HEADER_NAME] = "<redacted>";
      return clone;
    };

    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        if (this.debug) {
          console.error(
            JSON.stringify(
              {
                level: "debug",
                event: "http_request",
                method,
                url,
                headers: redactHeaders(headers),
                bodyBytes: body ? Buffer.byteLength(body, "utf8") : 0,
                attempt,
              },
              null,
              2
            )
          );
        }
        const response = await (globalThis as any).fetch(url, {
          method,
          headers,
          body,
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          let message = `HTTP ${response.status}`;
          let id: string | null | undefined;
          let details: unknown;
          try {
            const json = text ? JSON.parse(text) : undefined;
            if (json?.message) message = String(json.message);
            if (json?.id) id = json.id as string;
            if (json?.errors) details = json.errors;
          } catch {
            // ignore parse error
            if (text) message += `: ${text}`;
          }

          if (this.debug) {
            const preview = text ? text.slice(0, 500) : "";
            console.error(
              JSON.stringify(
                {
                  level: "debug",
                  event: "http_response_error",
                  status: response.status,
                  url,
                  message,
                  id,
                  preview,
                  attempt,
                },
                null,
                2
              )
            );
          }

          // 5xx はリトライ対象
          if (response.status >= 500 && attempt < retries) {
            const backoffMs = 500 * Math.pow(2, attempt);
            await new Promise((r) => setTimeout(r, backoffMs));
            continue;
          }

          throw new ApiServerError(response.status, message, id, details);
        }

        const contentType = (response.headers.get("content-type") || "").toLowerCase();
        const text = await response.text();
        if (this.debug) {
          const preview = text ? text.slice(0, 500) : "";
          console.error(
            JSON.stringify(
              {
                level: "debug",
                event: "http_response_ok",
                status: response.status,
                url,
                contentType,
                preview,
                attempt,
              },
              null,
              2
            )
          );
        }
        if (contentType.includes("application/json")) {
          return (text ? JSON.parse(text) : undefined) as T;
        }
        return text as unknown as T;
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;
        // リトライ条件は必要に応じて拡張
        if (attempt < retries) {
          continue;
        }
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }
}


