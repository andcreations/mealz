export function calculateFact(
  amount: number,
  factPer100: number,
): number {
  return (amount / 100) * factPer100;
}

export function calculateAmount(
  factValue: number,
  factPer100: number,
): number {
  return factValue * 100 / factPer100;
}