import { GbizinfoApiClient } from "../types.js";

export type SearchByNameFn = (params: {
  name: string;
  from?: number;
  size?: number;
}) => Promise<any>;

export function createGbizinfoApiClientFromFunction(
  fn: SearchByNameFn
): GbizinfoApiClient {
  return {
    searchCompanyByName: (params) => fn(params),
  };
}

export function createGbizinfoApiClientFromOpenapi(anyClient: any): GbizinfoApiClient {
  const candidates: Array<keyof any> = [
    // よくある命名
    "searchCompaniesByName",
    "searchCompanyByName",
    "searchCompanies",
    "getCompanies",
  ];

  for (const key of candidates) {
    const maybe = (anyClient as any)[key];
    if (typeof maybe === "function") {
      return createGbizinfoApiClientFromFunction(
        (params: { name: string; from?: number; size?: number }) => maybe(params)
      );
    }
  }

  if (typeof anyClient === "function") {
    return createGbizinfoApiClientFromFunction(anyClient as SearchByNameFn);
  }

  throw new Error(
    "OpenAPI クライアントの対応メソッドが見つかりませんでした。createGbizinfoApiClientFromFunction を使用してください。"
  );
}


