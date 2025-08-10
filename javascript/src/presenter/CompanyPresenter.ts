import { Company } from "../model/Company.js";
import { PaginatedResult } from "../model/Pagination.js";

export type CompanyListItemView = {
  corporateNumber: string;
  name: string;
  address: string;
  postalCode?: string;
};

export function presentCompanyList(companies: Company[]): CompanyListItemView[] {
  return companies.map((c) => ({
    corporateNumber: c.corporateNumber,
    name: c.name,
    address: [c.prefecture, c.city, c.address].filter(Boolean).join("") || "",
    postalCode: c.postalCode,
  }));
}

export type CompanyListPageView = {
  items: CompanyListItemView[];
  total: number;
  from: number;
  size: number;
};

export function presentCompanyListPage(
  page: PaginatedResult<Company>
): CompanyListPageView {
  return {
    items: presentCompanyList(page.items),
    total: page.total,
    from: page.from,
    size: page.size,
  };
}


