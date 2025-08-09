import "dotenv/config";
if (!process.env.GBIZINFO_API_TOKEN) {
  process.env.GBIZINFO_API_TOKEN = "dummy";
}

async function run() {
  const { CompanySearchController } = await import(
    "../src/controller/CompanySearchController.js"
  );
  const { GbizinfoService } = await import(
    "../src/services/gbizinfoService.js"
  );

  const controller = new CompanySearchController(new GbizinfoService());
  try {
    await controller.searchByName("サンプル");
  } catch (e) {
    console.log("dev runner ok (service not implemented):", (e as Error).message);
  }
}

run();


