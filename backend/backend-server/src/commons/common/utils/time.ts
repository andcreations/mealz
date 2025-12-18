export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

export function minutesToMs(minutes: number): number {
  return minutes * secondsToMs(60);
}

export function hoursToMs(hours: number): number {
  return hours * minutesToMs(60);
}

export function daysToMs(days: number): number {
  return days * hoursToMs(24);
}