export interface GbizinfoApiClient {
  searchCompanyByName(params: {
    name: string;
    page?: number;
    limit?: number;
  }): Promise<any>;
}


