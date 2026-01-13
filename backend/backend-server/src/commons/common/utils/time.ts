import { DateTime } from 'luxon';
import { getStrEnv } from '../env';

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

export function resolveTimeZone(): string {
  return getStrEnv('MEALZ_TIME_ZONE', 'UTC');
}

export function todayRange(timeZone: string): {
  fromDate: number;
  toDate: number;
} {
  const now = Date.now();
  const fromDate = DateTime
    .fromMillis(now)
    .setZone(timeZone)
    .startOf('day')
    .toMillis();
  const toDate = DateTime
    .fromMillis(now)
    .setZone(timeZone)
    .endOf('day')
    .toMillis();
  return { fromDate, toDate };
}