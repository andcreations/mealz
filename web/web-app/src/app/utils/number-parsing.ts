export function parsePositiveInteger(
  input: string,
  defaultOnInvalid?: number,
): number {
  if (/^\d+$/.test(input)) {
    return Number(input);
  }
  return defaultOnInvalid ?? NaN;
}

export function parseInteger(
  input: string,
  defaultOnInvalid?: number,
): number {
  if (/^-?\d+$/.test(input)) {
    return Number(input);
  }
  return defaultOnInvalid ?? NaN;
}