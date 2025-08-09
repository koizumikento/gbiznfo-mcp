import { GbizinfoService } from "../services/gbizinfoService.js";
import { Company } from "../model/Company.js";
import { PaginatedResult } from "../model/Pagination.js";
import { InputValidationError } from "../errors.js";

export class CompanySearchController {
  constructor(private readonly service: GbizinfoService) {}

  async searchByName(
    name: string,
    from?: number,
    size?: number
  ): Promise<PaginatedResult<Company>> {
    if (!name || name.trim().length === 0) {
      throw new InputValidationError("name is required");
    }
    return this.service.searchCompaniesByName(name.trim(), from, size);
  }

  async search(
    params: {
      name?: string;
      corporateNumber?: string;
      corporateType?: string;
      existFlg?: boolean;
      prefecture?: string;
      city?: string;
      address?: string;
      industry?: string;
      capitalStockFrom?: number;
      capitalStockTo?: number;
      employeeNumberFrom?: number;
      employeeNumberTo?: number;
      establishmentFrom?: string;
      establishmentTo?: string;
      from?: number;
      size?: number;
    }
  ): Promise<PaginatedResult<Company>> {
    if (!params.name && !params.corporateNumber && !params.prefecture && !params.city && !params.address && !params.industry) {
      throw new InputValidationError("at least one filter (name/corporateNumber/prefecture/city) is required");
    }
    return this.service.searchCompanies({
      name: params.name?.trim(),
      corporateNumber: params.corporateNumber?.trim(),
      corporateType: params.corporateType?.trim(),
      existFlg: params.existFlg,
      prefecture: params.prefecture?.trim(),
      city: params.city?.trim(),
      address: params.address?.trim(),
      industry: params.industry?.trim(),
      capitalStockFrom: params.capitalStockFrom,
      capitalStockTo: params.capitalStockTo,
      employeeNumberFrom: params.employeeNumberFrom,
      employeeNumberTo: params.employeeNumberTo,
      establishmentFrom: params.establishmentFrom,
      establishmentTo: params.establishmentTo,
      page: params.from,
      limit: params.size,
    });
  }
}


