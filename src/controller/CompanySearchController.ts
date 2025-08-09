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
}


