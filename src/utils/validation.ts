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


