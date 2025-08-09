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
    foundedYear?: string; // カンマ区切り可
    salesArea?: string; // カンマ区切り可（地域対応表のマスターコード）
    unifiedQualification?: string; // A,B,C,D カンマ区切り（従来型）
    unifiedQualificationSub01?: string; // A,B,C,D カンマ区切り
    unifiedQualificationSub02?: string; // A,B,C,D カンマ区切り
    unifiedQualificationSub03?: string; // A,B,C,D カンマ区切り
    unifiedQualificationSub04?: string; // A,B,C,D カンマ区切り
    netSalesFrom?: number;
    netSalesTo?: number;
    netIncomeLossFrom?: number;
    netIncomeLossTo?: number;
    totalAssetsFrom?: number;
    totalAssetsTo?: number;
    operatingRevenue1From?: number;
    operatingRevenue1To?: number;
    operatingRevenue2From?: number;
    operatingRevenue2To?: number;
    ordinaryIncomeLossFrom?: number;
    ordinaryIncomeLossTo?: number;
    ordinaryIncomeFrom?: number;
    ordinaryIncomeTo?: number;
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
    if (params.foundedYear) query.set("founded_year", params.foundedYear);
    if (params.salesArea) query.set("sales_area", params.salesArea);
    if (params.unifiedQualification) query.set("unified_qualification", params.unifiedQualification);
    if (params.unifiedQualificationSub01) query.set("unified_qualification_sub01", params.unifiedQualificationSub01);
    if (params.unifiedQualificationSub02) query.set("unified_qualification_sub02", params.unifiedQualificationSub02);
    if (params.unifiedQualificationSub03) query.set("unified_qualification_sub03", params.unifiedQualificationSub03);
    if (params.unifiedQualificationSub04) query.set("unified_qualification_sub04", params.unifiedQualificationSub04);
    if (typeof params.netSalesFrom === "number") query.set("net_sales_summary_of_business_results_from", String(params.netSalesFrom));
    if (typeof params.netSalesTo === "number") query.set("net_sales_summary_of_business_results_to", String(params.netSalesTo));
    if (typeof params.netIncomeLossFrom === "number") query.set("net_income_loss_summary_of_business_results_from", String(params.netIncomeLossFrom));
    if (typeof params.netIncomeLossTo === "number") query.set("net_income_loss_summary_of_business_results_to", String(params.netIncomeLossTo));
    if (typeof params.totalAssetsFrom === "number") query.set("total_assets_summary_of_business_results_from", String(params.totalAssetsFrom));
    if (typeof params.totalAssetsTo === "number") query.set("total_assets_summary_of_business_results_to", String(params.totalAssetsTo));
    if (typeof params.operatingRevenue1From === "number") query.set("operating_revenue1_summary_of_business_results_from", String(params.operatingRevenue1From));
    if (typeof params.operatingRevenue1To === "number") query.set("operating_revenue1_summary_of_business_results_to", String(params.operatingRevenue1To));
    if (typeof params.operatingRevenue2From === "number") query.set("operating_revenue2_summary_of_business_results_from", String(params.operatingRevenue2From));
    if (typeof params.operatingRevenue2To === "number") query.set("operating_revenue2_summary_of_business_results_to", String(params.operatingRevenue2To));
    if (typeof params.ordinaryIncomeLossFrom === "number") query.set("ordinary_income_loss_summary_of_business_results_from", String(params.ordinaryIncomeLossFrom));
    if (typeof params.ordinaryIncomeLossTo === "number") query.set("ordinary_income_loss_summary_of_business_results_to", String(params.ordinaryIncomeLossTo));
    if (typeof params.ordinaryIncomeFrom === "number") query.set("ordinary_income_summary_of_business_results_from", String(params.ordinaryIncomeFrom));
    if (typeof params.ordinaryIncomeTo === "number") query.set("ordinary_income_summary_of_business_results_to", String(params.ordinaryIncomeTo));
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


