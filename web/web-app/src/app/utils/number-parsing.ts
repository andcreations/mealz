export function parsePositiveInteger(
  input: string,
  defaultOnInvalid?: number,
): number {
  if (/^\d+$/.test(input)) {
    return Number(input);
  }
  return defaultOnInvalid ?? NaN;
}