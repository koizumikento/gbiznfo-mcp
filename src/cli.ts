#!/usr/bin/env node
import { loadEnv } from "./utils/env.js";
loadEnv();
import { CompanySearchController } from "./controller/CompanySearchController.js";
import { GbizinfoService } from "./services/gbizinfoService.js";
import { HttpClient } from "./services/http.js";
import { presentCompanyListPage } from "./presenter/CompanyPresenter.js";

async function main(argv: string[]): Promise<number> {
  const [cmd, ...rest] = argv;

  if (cmd === "search") {
    const flags = rest.filter((a) => a.startsWith("-"));
    const args = rest.filter((a) => !a.startsWith("-"));
    const debug =
      process.env.GBIZINFO_DEBUG === "1" ||
      flags.includes("--debug") ||
      flags.includes("-d");

    const name = args[0];
    const from = args[1] ? Number(args[1]) : undefined;
    const size = args[2] ? Number(args[2]) : undefined;

    if (!name) {
      console.error("Usage: gbizinfo search <name> [from] [size]");
      return 1;
    }

    const http = new HttpClient({ debug });
    const controller = new CompanySearchController(new GbizinfoService(http));
    const page = await controller.searchByName(name, from, size);
    const view = presentCompanyListPage(page);
    console.log(JSON.stringify(view, null, 2));
    return 0;
  }

  console.log("gbizinfo <command>\n\nCommands:\n  search <name> [from] [size]");
  return 0;
}

main(process.argv.slice(2)).then(
  (code) => {
    if (code !== 0) process.exit(code);
  },
  (err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
);


