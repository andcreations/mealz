export function parsePositiveInteger(input: string): number {
  if (/^\d+$/.test(input)) {
    return Number(input);
  }
  return NaN;
}