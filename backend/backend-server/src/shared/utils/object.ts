export function ifDefined<T = any, V = any, R = any>(
  key: keyof T,
  value: V,
): { [key: string]: V } | {} {
  return value !== undefined ? { [key]: value } : {};
}

export function mapIfDefined<T = any, V = any, R = any>(
  key: keyof T,
  value: V,
  mapper: (value: V) => R,
): { [key: string]: R } | {} {
  return value != null ? { [key]: mapper(value) } : {};
}
