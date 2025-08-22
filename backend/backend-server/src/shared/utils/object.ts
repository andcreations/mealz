export function ifDefined<T = any>(
  key: keyof T,
  value: any,
): { [key: string]: any } | {} {
  return value !== undefined ? { [key]: value } : {};
}
