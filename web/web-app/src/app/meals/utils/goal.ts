export function isGoalError(
  amount: number,
  goalFrom?: number,
  goalTo?: number,
): boolean {
  if (!goalFrom || !goalTo) {
    return false;
  }
  return Math.ceil(amount) < goalFrom || Math.floor(amount) > goalTo;
}