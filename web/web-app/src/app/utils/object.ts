type IfSetResult<T> = Record<Partial<keyof T>, any>;

export function ifValueDefined<T = any>(
  key: keyof T,
  value: any,
): Record<string, number | boolean | undefined> {
  return value !== undefined ? { [key]: value } : {};
}

export function ifDefined<T>(
  object: T, keys: Array<keyof T>,
): IfSetResult<T> {
  const result = {} as IfSetResult<T>;
  keys.forEach(key => {
    if (key !== undefined) {
      result[key] = object[key];
    }
  })
  return result;
}