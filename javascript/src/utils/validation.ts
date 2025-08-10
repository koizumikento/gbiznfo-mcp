const ALLOWED_CORPORATE_TYPES = new Set([
  "101", // 国の機関
  "201", // 地方公共団体
  "301", // 株式会社
  "302", // 有限会社
  "303", // 合名会社
  "304", // 合資会社
  "305", // 合同会社
  "399", // その他の設立登記法人
  "401", // 外国会社等
  "499", // その他
]);

export function isValidCorporateType(codes: string): boolean {
  const parts = codes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (parts.length === 0) return false;
  return parts.every((code) => ALLOWED_CORPORATE_TYPES.has(code));
}

export function findInvalidCorporateTypeCodes(codes: string): string[] {
  const parts = codes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return parts.filter((code) => !ALLOWED_CORPORATE_TYPES.has(code));
}


// Sales area (region) validation: gBizINFO master codes 1..10, comma-separated
const ALLOWED_SALES_AREA_CODES = new Set(
  Array.from({ length: 10 }, (_, i) => String(i + 1))
);

export function isValidSalesAreaCodes(codes: string): boolean {
  const parts = codes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (parts.length === 0) return false;
  return parts.every((code) => ALLOWED_SALES_AREA_CODES.has(code));
}

export function findInvalidSalesAreaCodes(codes: string): string[] {
  const parts = codes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return parts.filter((code) => !ALLOWED_SALES_AREA_CODES.has(code));
}

// Unified qualification validation: A,B,C,D comma-separated
const ALLOWED_UQ = new Set(["A", "B", "C", "D"]);

export function isValidUnifiedQualificationCodes(codes: string): boolean {
  const parts = codes
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => s.length > 0);
  if (parts.length === 0) return false;
  return parts.every((code) => ALLOWED_UQ.has(code));
}

export function findInvalidUnifiedQualificationCodes(codes: string): string[] {
  const parts = codes
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => s.length > 0);
  return parts.filter((code) => !ALLOWED_UQ.has(code));
}

// Business item codes: explicit whitelist based on gBizINFO codelist
// 物品の製造: 101-124, 127, 128, 129（125,126はなし）
// 物品の販売: 201-224, 227, 228, 229（225,226はなし）
// 役務の提供等: 301-315
// 物品の買受け: 401, 402
const ALLOWED_BUSINESS_ITEM_CODES = new Set<string>([
  // 物品の製造
  "101","102","103","104","105","106","107","108","109","110",
  "111","112","113","114","115","116","117","118","119","120",
  "121","122","123","124","127","128","129",
  // 物品の販売
  "201","202","203","204","205","206","207","208","209","210",
  "211","212","213","214","215","216","217","218","219","220",
  "221","222","223","224","227","228","229",
  // 役務の提供等
  "301","302","303","304","305","306","307","308","309","310",
  "311","312","313","314","315",
  // 物品の買受け
  "401","402",
]);

export function isValidBusinessItemCodes(codes: string): boolean {
  const parts = codes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (parts.length === 0) return false;
  return parts.every((code) => ALLOWED_BUSINESS_ITEM_CODES.has(code));
}

export function findInvalidBusinessItemCodes(codes: string): string[] {
  const parts = codes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return parts.filter((code) => !ALLOWED_BUSINESS_ITEM_CODES.has(code));
}

// Numeric non-negative integer check
export function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

// Generic: comma-separated positive integers (no leading zeros unless single zero disallowed)
export function isValidCommaSeparatedPositiveIntegers(codes: string): boolean {
  const parts = codes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (parts.length === 0) return false;
  return parts.every((p) => /^[1-9]\d*$/.test(p));
}

export function findInvalidPositiveIntegers(codes: string): string[] {
  const parts = codes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return parts.filter((p) => !/^[1-9]\d*$/.test(p));
}

