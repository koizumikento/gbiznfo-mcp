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
          name: "search_companies",
          description: "企業名で gBizINFO を検索します。",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "企業名（部分一致）" },
              from: { type: "number", description: "開始位置(1始まり)", minimum: 1 },
              size: { type: "number", description: "取得件数", minimum: 1 }
            },
            required: ["name"],
            additionalProperties: false
          }
        },
        {
          name: "search",
          description: "gBizINFO を複合条件で検索します（Swaggerの検索クエリを個別パラメータで受け付け）。",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "企業名（部分一致）" },
              corporateNumber: { type: "string", description: "法人番号 (corporate_number)" },
              corporateType: { type: "string", description: "法人種別コード（カンマ区切り）" },
              existFlg: { type: "boolean", description: "法人活動情報の有無" },
              prefecture: { type: "string", description: "都道府県名" },
              city: { type: "string", description: "市区町村名" },
              address: { type: "string", description: "住所（フリーテキスト）" },
              industry: { type: "string", description: "業種（フリーテキストまたはコード）" },
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
            properties: { corporateNumber: { type: "string" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_certification",
          description: "法人番号で届出・認定情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_commendation",
          description: "法人番号で表彰情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_finance",
          description: "法人番号で財務情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_patent",
          description: "法人番号で特許情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_procurement",
          description: "法人番号で調達情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_subsidy",
          description: "法人番号で補助金情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string" } },
            required: ["corporateNumber"],
            additionalProperties: false
          }
        },
        {
          name: "get_workplace",
          description: "法人番号で職場情報を取得します。",
          inputSchema: {
            type: "object",
            properties: { corporateNumber: { type: "string" } },
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
      case "search_companies": {
        const args = (req.params.arguments ?? {}) as { name: string; from?: number; size?: number };
        const page = await controller.searchByName(args.name, args.from, args.size);
        const view = presentCompanyListPage(page);
        return { content: [{ type: "text", text: JSON.stringify(view, null, 2) }] };
      }
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


