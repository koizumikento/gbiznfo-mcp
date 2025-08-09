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
    postalCode: apiItem?.postal_code ?? apiItem?.postalCode ?? apiItem?.zip ?? undefined,
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

  private buildDetailUrl(corporateNumber: string, subPath?: string): string {
    const base = `${this.baseUrl}/${encodeURIComponent(corporateNumber)}`;
    return subPath ? `${base}/${subPath}` : base;
  }

  async getBasicInfo(corporateNumber: string): Promise<unknown> {
    const url = this.buildDetailUrl(corporateNumber);
    try {
      return await this.http.request<unknown>(url, { method: "GET" });
    } catch (e) {
      throw new ApiCommunicationError((e as Error).message);
    }
  }

  async getCertification(corporateNumber: string): Promise<unknown> {
    const url = this.buildDetailUrl(corporateNumber, "certification");
    try {
      return await this.http.request<unknown>(url, { method: "GET" });
    } catch (e) {
      throw new ApiCommunicationError((e as Error).message);
    }
  }

  async getCommendation(corporateNumber: string): Promise<unknown> {
    const url = this.buildDetailUrl(corporateNumber, "commendation");
    try {
      return await this.http.request<unknown>(url, { method: "GET" });
    } catch (e) {
      throw new ApiCommunicationError((e as Error).message);
    }
  }

  async getFinance(corporateNumber: string): Promise<unknown> {
    const url = this.buildDetailUrl(corporateNumber, "finance");
    try {
      return await this.http.request<unknown>(url, { method: "GET" });
    } catch (e) {
      throw new ApiCommunicationError((e as Error).message);
    }
  }

  async getPatent(corporateNumber: string): Promise<unknown> {
    const url = this.buildDetailUrl(corporateNumber, "patent");
    try {
      return await this.http.request<unknown>(url, { method: "GET" });
    } catch (e) {
      throw new ApiCommunicationError((e as Error).message);
    }
  }

  async getProcurement(corporateNumber: string): Promise<unknown> {
    const url = this.buildDetailUrl(corporateNumber, "procurement");
    try {
      return await this.http.request<unknown>(url, { method: "GET" });
    } catch (e) {
      throw new ApiCommunicationError((e as Error).message);
    }
  }

  async getSubsidy(corporateNumber: string): Promise<unknown> {
    const url = this.buildDetailUrl(corporateNumber, "subsidy");
    try {
      return await this.http.request<unknown>(url, { method: "GET" });
    } catch (e) {
      throw new ApiCommunicationError((e as Error).message);
    }
  }

  async getWorkplace(corporateNumber: string): Promise<unknown> {
    const url = this.buildDetailUrl(corporateNumber, "workplace");
    try {
      return await this.http.request<unknown>(url, { method: "GET" });
    } catch (e) {
      throw new ApiCommunicationError((e as Error).message);
    }
  }

  async searchCompaniesByName(
    name: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResult<Company>> {
    return this.searchCompanies({ name, page, limit });
  }

  async searchCompanies(params: {
    name?: string;
    corporateNumber?: string;
    corporateType?: string; // カンマ区切りコード
    existFlg?: boolean;
    prefecture?: string;
    city?: string;
    address?: string;
    industry?: string;
    businessItem?: string; // カンマ区切り可（GEPS 営業品目コード）
    capitalStockFrom?: number;
    capitalStockTo?: number;
    employeeNumberFrom?: number;
    employeeNumberTo?: number;
    establishmentFrom?: string; // YYYY-MM-DD
    establishmentTo?: string;   // YYYY-MM-DD
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<Company>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    // 生成クライアントがある場合の利用は将来的に拡張。
    // 現状は HTTP フォールバックを共通利用。

    const query = new URLSearchParams();
    if (params.name) query.set("name", params.name);
    if (params.corporateNumber) query.set("corporate_number", params.corporateNumber);
    if (params.corporateType) query.set("corporate_type", params.corporateType);
    if (typeof params.existFlg === "boolean") query.set("exist_flg", String(params.existFlg));
    if (params.prefecture) query.set("prefecture", params.prefecture);
    if (params.city) query.set("city", params.city);
    if (params.address) query.set("address", params.address);
    if (params.industry) query.set("industry", params.industry);
    if (params.businessItem) query.set("business_item", params.businessItem);
    if (typeof params.capitalStockFrom === "number") query.set("capital_stock_from", String(params.capitalStockFrom));
    if (typeof params.capitalStockTo === "number") query.set("capital_stock_to", String(params.capitalStockTo));
    if (typeof params.employeeNumberFrom === "number") query.set("employee_number_from", String(params.employeeNumberFrom));
    if (typeof params.employeeNumberTo === "number") query.set("employee_number_to", String(params.employeeNumberTo));
    if (params.establishmentFrom) query.set("establishment_from", params.establishmentFrom);
    if (params.establishmentTo) query.set("establishment_to", params.establishmentTo);
    query.set("page", String(page));
    query.set("limit", String(limit));

    // ベースURLはフルパス（例: https://info.gbiz.go.jp/hojin/v1/hojin）に対し、クエリのみ付与
    // 仕様上のクエリ名は Swagger を参照し、必要に応じて調整
    const url = `${this.baseUrl}?${query.toString()}`; // [[memory:5638835]]

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


