export type CompanySearchParams = {
  name: string;
  page?: number;
  limit?: number;
};

export function buildSearchCompaniesPath(params: CompanySearchParams): string {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const q = new URLSearchParams({
    name: params.name,
    page: String(page),
    limit: String(limit),
  });
  // ベースURLはフルパス（例: https://info.gbiz.go.jp/hojin/v1/hojin）を想定し、クエリのみを付与
  return `?${q.toString()}`;
}

export function buildSearchCompaniesPathCandidates(
  params: CompanySearchParams
): string[] {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const q = new URLSearchParams({
    name: params.name,
    page: String(page),
    limit: String(limit),
  }).toString();
  // ベースURLが既にエンドポイントまで含むため、候補はクエリのみ
  return [`?${q}`];
}


