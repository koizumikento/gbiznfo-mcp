import { GbizinfoService } from "../services/gbizinfoService.js";
import { Company } from "../model/Company.js";
import { PaginatedResult } from "../model/Pagination.js";
import { InputValidationError } from "../errors.js";
import { isValidJisX0402CityCode, isValidJisX0401PrefectureCode } from "../utils/jis.js";
import { isValidCorporateType, findInvalidCorporateTypeCodes } from "../utils/validation.js";

export class CompanySearchController {
  constructor(private readonly service: GbizinfoService) {}

  async searchByName(
    name: string,
    from?: number,
    size?: number
  ): Promise<PaginatedResult<Company>> {

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
      businessItem?: string;
      foundedYear?: string;
      salesArea?: string;
      unifiedQualification?: string;
      unifiedQualificationSub01?: string;
      unifiedQualificationSub02?: string;
      unifiedQualificationSub03?: string;
      unifiedQualificationSub04?: string;
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
      establishmentFrom?: string;
      establishmentTo?: string;
      from?: number;
      size?: number;
    }
  ): Promise<PaginatedResult<Company>> {
    if (params.corporateType != null) {
      const ct = params.corporateType.trim();
      if (ct.length > 0 && !isValidCorporateType(ct)) {
        const invalid = findInvalidCorporateTypeCodes(ct);
        throw new InputValidationError(
          `corporateType は法人種別コード（101,201,301,302,303,304,305,399,401,499。複数はカンマ区切り）で指定してください。無効: ${invalid.join(", ")}`
        );
      }
    }

    if (params.prefecture != null) {
      const pref = params.prefecture.trim();
      if (pref.length > 0 && !isValidJisX0401PrefectureCode(pref)) {
        throw new InputValidationError(
          "prefecture は JIS X 0401（都道府県コード2桁）で指定してください。例: 01, 13, 27。"
        );
      }
    }

    if (params.city != null) {
      const city = params.city.trim();
      if (city.length > 0 && !isValidJisX0402CityCode(city)) {
        throw new InputValidationError(
          "city は JIS X 0402（市区町村コード3桁）で指定してください。例: 101, 201, 301。"
        );
      }
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
      businessItem: params.businessItem?.trim(),
      foundedYear: params.foundedYear?.trim(),
      salesArea: params.salesArea?.trim(),
      unifiedQualification: params.unifiedQualification?.trim(),
      unifiedQualificationSub01: params.unifiedQualificationSub01?.trim(),
      unifiedQualificationSub02: params.unifiedQualificationSub02?.trim(),
      unifiedQualificationSub03: params.unifiedQualificationSub03?.trim(),
      unifiedQualificationSub04: params.unifiedQualificationSub04?.trim(),
      netSalesFrom: params.netSalesFrom,
      netSalesTo: params.netSalesTo,
      netIncomeLossFrom: params.netIncomeLossFrom,
      netIncomeLossTo: params.netIncomeLossTo,
      totalAssetsFrom: params.totalAssetsFrom,
      totalAssetsTo: params.totalAssetsTo,
      operatingRevenue1From: params.operatingRevenue1From,
      operatingRevenue1To: params.operatingRevenue1To,
      operatingRevenue2From: params.operatingRevenue2From,
      operatingRevenue2To: params.operatingRevenue2To,
      ordinaryIncomeLossFrom: params.ordinaryIncomeLossFrom,
      ordinaryIncomeLossTo: params.ordinaryIncomeLossTo,
      ordinaryIncomeFrom: params.ordinaryIncomeFrom,
      ordinaryIncomeTo: params.ordinaryIncomeTo,
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


