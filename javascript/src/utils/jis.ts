export function isValidJisX0402CityCode(code: string): boolean {
  const trimmed = code.trim();
  if (!/^[0-9]{3}$/.test(trimmed)) return false;
  const n = Number(trimmed);
  return n >= 100 && n <= 799;
}

export function isValidJisX0401PrefectureCode(code: string): boolean {
  const trimmed = code.trim();
  if (!/^[0-9]{2}$/.test(trimmed)) return false;
  const n = Number(trimmed);
  return n >= 1 && n <= 47; // 01〜47
}


