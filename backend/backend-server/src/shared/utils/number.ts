export function truncateNumber(number?: number): number | undefined {
  if (number === undefined) {
    return undefined;
  }
  return Math.trunc(number);
}