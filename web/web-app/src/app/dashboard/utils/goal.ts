const GOAL_ERROR_PERCENTAGE = 10;

export function isGoalError(amount: number, goal?: number): boolean {
  if (!goal) {
    return false;
  }
  if (amount === 0) {
    return true;
  }
  const percent = (amount / goal) * 100;
  const percentDiff = Math.abs(percent - 100);
  return percentDiff > GOAL_ERROR_PERCENTAGE;
}