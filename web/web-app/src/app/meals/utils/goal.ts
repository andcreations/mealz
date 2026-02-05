export function isGoalError(
  amount: number,
  goalFrom?: number,
  goalTo?: number,
): boolean {
  if (!goalFrom || !goalTo) {
    return false;
  }
  return amount < goalFrom || amount > goalTo;
}