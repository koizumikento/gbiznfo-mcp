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
        }
      ]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    if (req.params.name !== "search_companies") {
      throw new Error(`Unknown tool: ${req.params.name}`);
    }

    const args = (req.params.arguments ?? {}) as { name: string; from?: number; size?: number };

    const debug = process.env.GBIZINFO_DEBUG === "1";
    const http = new HttpClient({ debug });
    const controller = new CompanySearchController(new GbizinfoService(http));
    const page = await controller.searchByName(args.name, args.from, args.size);
    const view = presentCompanyListPage(page);

    return { content: [{ type: "text", text: JSON.stringify(view, null, 2) }] };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});


