#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { loadEnv } from "../utils/env.js";
import { CompanySearchController } from "../controller/CompanySearchController.js";
import { GbizinfoService } from "../services/gbizinfoService.js";
import { HttpClient } from "../services/http.js";
import { presentCompanyListPage } from "../presenter/CompanyPresenter.js";

async function run(): Promise<void> {
  loadEnv();

  const server = new Server(
    { name: "gbizinfo-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "search",
          description: "gBizINFO を複合条件で検索します（Swaggerの検索クエリを個別パラメータで受け付け）。",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "企業名（部分一致）" },
              corporateNumber: { type: "string", description: "法人番号 (corporate_number)" },
              corporateType: { type: "string", description: "法人種別コード（101: 国の機関, 201: 地方公共団体, 301: 株式会社, 302: 有限会社, 303: 合名会社, 304: 合資会社, 305: 合同会社, 399: その他の設立登記法人, 401: 外国会社等, 499: その他。複数はカンマ区切り）" },
              existFlg: { type: "boolean", description: "法人活動情報の有無" },
              prefecture: { type: "string", description: "都道府県コード（JIS X 0401の2桁）" },
              city: { type: "string", description: "市区町村コード（JIS X 0402の3桁）" },
              address: { type: "string", description: "住所（フリーテキスト）" },
              industry: { type: "string", description: "業種（フリーテキストまたはコード）" },
              businessItem: { type: "string", description: "営業品目コード（GEPS）。例: 101, 206。複数はカンマ区切り" },
              foundedYear: { type: "string", description: "創業年・設立年（カンマ区切り可）" },
              salesArea: { type: "string", description: "営業エリア（地域対応表のgBizINFOマスターコード。カンマ区切り可）" },
              unifiedQualification: { type: "string", description: "全省庁統一資格の資格等級（従来型）。A,B,C,D をカンマ区切りで指定" },
              unifiedQualificationSub01: { type: "string", description: "資格等級(物品の製造)：A,B,C,D をカンマ区切りで指定" },
              unifiedQualificationSub02: { type: "string", description: "資格等級(物品の販売)：A,B,C,D をカンマ区切りで指定" },
              unifiedQualificationSub03: { type: "string", description: "資格等級(役務の提供等)：A,B,C,D をカンマ区切りで指定" },
              unifiedQualificationSub04: { type: "string", description: "資格等級(物品の買受け)：A,B,C,D をカンマ区切りで指定" },
              netSalesFrom: { type: "number", description: "売上高（以上）" },
              netSalesTo: { type: "number", description: "売上高（以下）" },
              netIncomeLossFrom: { type: "number", description: "当期純利益又は当期純損失（以上）" },
              netIncomeLossTo: { type: "number", description: "当期純利益又は当期純損失（以下）" },
              totalAssetsFrom: { type: "number", description: "総資産額（以上）" },
              totalAssetsTo: { type: "number", description: "総資産額（以下）" },
              operatingRevenue1From: { type: "number", description: "営業収益（以上）" },
              operatingRevenue1To: { type: "number", description: "営業収益（以下）" },
              operatingRevenue2From: { type: "number", description: "営業収入（以上）" },
              operatingRevenue2To: { type: "number", description: "営業収入（以下）" },
              ordinaryIncomeLossFrom: { type: "number", description: "経常利益又は経常損失（以上）" },
              ordinaryIncomeLossTo: { type: "number", description: "経常利益又は経常損失（以下）" },
              ordinaryIncomeFrom: { type: "number", description: "経常収益（以上）" },
              ordinaryIncomeTo: { type: "number", description: "経常収益（以下）" },
              capitalStockFrom: { type: "number", description: "資本金（下限）" },
              capitalStockTo: { type: "number", description: "資本金（上限）" },
              employeeNumberFrom: { type: "number", description: "従業員数（下限）" },
              employeeNumberTo: { type: "number", description: "従業員数（上限）" },
              establishmentFrom: { type: "string", description: "設立日（下限, YYYY-MM-DD）" },
              establishmentTo: { type: "string", description: "設立日（上限, YYYY-MM-DD）" },
              from: { type: "number", description: "開始位置(1始まり)", minimum: 1 },
              size: { type: "number", description: "取得件数", minimum: 1 },
            },
            additionalProperties: false
          }
        },
        {
          name: "get_basic_info",
          description: "法人番号で基本情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string", description: "法人番号 (corporate_number)" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_certification",
          description: "法人番号で届出・認定情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string", description: "法人番号 (corporate_number)" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_commendation",
          description: "法人番号で表彰情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string", description: "法人番号 (corporate_number)" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_finance",
          description: "法人番号で財務情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string", description: "法人番号 (corporate_number)" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_patent",
          description: "法人番号で特許情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string", description: "法人番号 (corporate_number)" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_procurement",
          description: "法人番号で調達情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string", description: "法人番号 (corporate_number)" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_subsidy",
          description: "法人番号で補助金情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string", description: "法人番号 (corporate_number)" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_workplace",
          description: "法人番号で職場情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string", description: "法人番号 (corporate_number)" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        }
      ]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const debug = process.env.GBIZINFO_DEBUG === "1";
    const http = new HttpClient({ debug });
    const controller = new CompanySearchController(new GbizinfoService(http));

    switch (req.params.name) {
      case "search": {
        const args = (req.params.arguments ?? {}) as {
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
        };
        const page = await controller.search({
          name: args.name,
          corporateNumber: args.corporateNumber,
          corporateType: args.corporateType,
          existFlg: args.existFlg,
          prefecture: args.prefecture,
          city: args.city,
          address: args.address,
          industry: args.industry,
          businessItem: args.businessItem,
          foundedYear: args.foundedYear,
          salesArea: args.salesArea,
          unifiedQualification: args.unifiedQualification,
          unifiedQualificationSub01: args.unifiedQualificationSub01,
          unifiedQualificationSub02: args.unifiedQualificationSub02,
          unifiedQualificationSub03: args.unifiedQualificationSub03,
          unifiedQualificationSub04: args.unifiedQualificationSub04,
          netSalesFrom: args.netSalesFrom,
          netSalesTo: args.netSalesTo,
          netIncomeLossFrom: args.netIncomeLossFrom,
          netIncomeLossTo: args.netIncomeLossTo,
          totalAssetsFrom: args.totalAssetsFrom,
          totalAssetsTo: args.totalAssetsTo,
          operatingRevenue1From: args.operatingRevenue1From,
          operatingRevenue1To: args.operatingRevenue1To,
          operatingRevenue2From: args.operatingRevenue2From,
          operatingRevenue2To: args.operatingRevenue2To,
          ordinaryIncomeLossFrom: args.ordinaryIncomeLossFrom,
          ordinaryIncomeLossTo: args.ordinaryIncomeLossTo,
          ordinaryIncomeFrom: args.ordinaryIncomeFrom,
          ordinaryIncomeTo: args.ordinaryIncomeTo,
          capitalStockFrom: args.capitalStockFrom,
          capitalStockTo: args.capitalStockTo,
          employeeNumberFrom: args.employeeNumberFrom,
          employeeNumberTo: args.employeeNumberTo,
          establishmentFrom: args.establishmentFrom,
          establishmentTo: args.establishmentTo,
          from: args.from,
          size: args.size,
        });
        const view = presentCompanyListPage(page);
        return { content: [{ type: "text", text: JSON.stringify(view, null, 2) }] };
      }
      case "get_basic_info": {
        const { corporateNumber } = (req.params.arguments ?? {}) as { corporateNumber: string };
        const svc = new GbizinfoService(http);
        const data = await svc.getBasicInfo(corporateNumber);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
      case "get_certification": {
        const { corporateNumber } = (req.params.arguments ?? {}) as { corporateNumber: string };
        const svc = new GbizinfoService(http);
        const data = await svc.getCertification(corporateNumber);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
      case "get_commendation": {
        const { corporateNumber } = (req.params.arguments ?? {}) as { corporateNumber: string };
        const svc = new GbizinfoService(http);
        const data = await svc.getCommendation(corporateNumber);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
      case "get_finance": {
        const { corporateNumber } = (req.params.arguments ?? {}) as { corporateNumber: string };
        const svc = new GbizinfoService(http);
        const data = await svc.getFinance(corporateNumber);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
      case "get_patent": {
        const { corporateNumber } = (req.params.arguments ?? {}) as { corporateNumber: string };
        const svc = new GbizinfoService(http);
        const data = await svc.getPatent(corporateNumber);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
      case "get_procurement": {
        const { corporateNumber } = (req.params.arguments ?? {}) as { corporateNumber: string };
        const svc = new GbizinfoService(http);
        const data = await svc.getProcurement(corporateNumber);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
      case "get_subsidy": {
        const { corporateNumber } = (req.params.arguments ?? {}) as { corporateNumber: string };
        const svc = new GbizinfoService(http);
        const data = await svc.getSubsidy(corporateNumber);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
      case "get_workplace": {
        const { corporateNumber } = (req.params.arguments ?? {}) as { corporateNumber: string };
        const svc = new GbizinfoService(http);
        const data = await svc.getWorkplace(corporateNumber);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${req.params.name}`);
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});


