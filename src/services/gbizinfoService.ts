import { HttpClient } from "./http.js";
import { Company } from "../model/Company.js";
import { config } from "../config.js";
import { PaginatedResult } from "../model/Pagination.js";
import type { GbizinfoApiClient } from "./types.js";
import { ApiCommunicationError } from "../errors.js";

function mapApiToDomainCompanies(apiItem: any): Company {
  return {
    corporateNumber: String(apiItem?.corporate_number ?? apiItem?.corporateNumber ?? ""),
    name: String(apiItem?.name ?? apiItem?.name_jp ?? apiItem?.nameJp ?? ""),
    prefecture: apiItem?.prefecture_name ?? apiItem?.prefecture ?? apiItem?.prefectureName,
    city: apiItem?.city_name ?? apiItem?.city ?? apiItem?.cityName,
    address: apiItem?.address ?? apiItem?.street ?? apiItem?.location ?? undefined,
    industry: apiItem?.sic ?? apiItem?.industry ?? undefined,
  };
}

export class GbizinfoService {
  private readonly http: HttpClient;
  private readonly baseUrl: string;
  private readonly client?: GbizinfoApiClient;

  constructor(httpClient?: HttpClient, apiClient?: GbizinfoApiClient) {
    this.http = httpClient ?? new HttpClient();
    this.baseUrl = config.gbizinfoBaseUrl.replace(/\/$/, "");
    this.client = apiClient;
  }

  async searchCompaniesByName(
    name: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResult<Company>> {
    if (this.client) {
      const res: any = await this.client.searchCompanyByName({ name, page, limit });
      const items: any[] =
        (res && (res["hojin-infos"] as any[])) ?? res?.items ?? res?.results ?? [];
      const total: number = Number(
        res?.total ?? res?.count ?? res?.["total-count"] ?? items.length
      );
      return {
        items: items.map(mapApiToDomainCompanies),
        total,
        from: page,
        size: limit,
      };
    }

    // フォールバック: 生成クライアント未導入でも最低限動くHTTP直叩き
    const url = `${this.baseUrl}?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`;
    try {
      const res = await this.http.request<any>(url, { method: "GET" });
      const items: any[] =
        (res && (res["hojin-infos"] as any[])) ?? res?.items ?? res?.results ?? [];
      const total: number = Number(
        res?.total ?? res?.count ?? res?.["total-count"] ?? items.length
      );
      return {
        items: items.map(mapApiToDomainCompanies),
        total,
        from: page,
        size: limit,
      };
    } catch (e) {
      throw new ApiCommunicationError((e as Error).message);
    }
  }
}


