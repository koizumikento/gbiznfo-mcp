import { config } from "../config.js";
import { HttpClient } from "./http.js";
import { buildSearchCompaniesPath, buildSearchCompaniesPathCandidates } from "./endpoints.js";

export class GbizinfoApiClientImpl {
  constructor(private readonly http: HttpClient) {}

  async searchCompanyByName(params: {
    name: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const baseUrl = config.gbizinfoBaseUrl.replace(/\/$/, "");
    const candidates = buildSearchCompaniesPathCandidates(params);
    let lastError: unknown;
    for (const path of candidates) {
      try {
        const url = `${baseUrl}${path}`;
        return await this.http.request<any>(url, { method: "GET" });
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }
}


