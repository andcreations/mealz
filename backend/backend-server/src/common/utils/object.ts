export function ifDefined<T = any>(
  key: keyof T,
  value: T[keyof T],
): { [key: string]: any } | {} {
  return value !== undefined ? { [key]: value } : {};
}
