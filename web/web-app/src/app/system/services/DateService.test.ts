import { DateTime, Settings } from 'luxon';

jest.mock('./SystemService', () => ({
  SystemService: class {
    getTimeZone() { return 'UTC'; }
  },
}));

import { DateService } from './DateService';
import { SystemService } from './SystemService';

const createDateService = (): DateService => {
  return new DateService(new SystemService());
};

const mockNow = (
  year: number, month: number, day: number,
  hour: number, minute: number, second: number,
): void => {
  const millis = Date.UTC(year, month - 1, day, hour, minute, second);
  Settings.now = () => millis;
};

describe('DateService.differenceInDaysFromNow', () => {
  const dateService = createDateService();

  beforeEach(() => {
    Settings.defaultZone = 'UTC';
  });

  afterEach(() => {
    Settings.now = () => Date.now();
    Settings.defaultZone = 'system';
  });

  it('should return 0 for today', () => {
    mockNow(2026, 3, 16, 12, 0, 0);
    const date = DateTime.utc(2026, 3, 16, 14, 30, 0);
    expect(dateService.differenceInDaysFromNow(date)).toBe(0);
  });

  it('should return -1 for yesterday', () => {
    mockNow(2026, 3, 16, 12, 0, 0);
    const date = DateTime.utc(2026, 3, 15, 12, 0, 0);
    expect(dateService.differenceInDaysFromNow(date)).toBe(-1);
  });

  it('should return 1 for tomorrow', () => {
    mockNow(2026, 3, 16, 12, 0, 0);
    const date = DateTime.utc(2026, 3, 17, 12, 0, 0);
    expect(dateService.differenceInDaysFromNow(date)).toBe(1);
  });

  it('should return 0 for today when now is at the beginning of the day', () => {
    mockNow(2026, 3, 16, 0, 0, 0);
    const date = DateTime.utc(2026, 3, 16, 15, 0, 0);
    expect(dateService.differenceInDaysFromNow(date)).toBe(0);
  });

  it('should return 0 for today when now is at the end of the day', () => {
    mockNow(2026, 3, 16, 23, 59, 59);
    const date = DateTime.utc(2026, 3, 16, 8, 0, 0);
    expect(dateService.differenceInDaysFromNow(date)).toBe(0);
  });

  it('should return -1 for yesterday when now is at the end of the day', () => {
    mockNow(2026, 3, 16, 23, 59, 59);
    const date = DateTime.utc(2026, 3, 15, 12, 0, 0);
    expect(dateService.differenceInDaysFromNow(date)).toBe(-1);
  });

  it('should return correct difference when the date is at the beginning of its day', () => {
    mockNow(2026, 3, 16, 12, 0, 0);
    const date = DateTime.utc(2026, 3, 14, 0, 0, 0);
    expect(dateService.differenceInDaysFromNow(date)).toBe(-2);
  });

  it('should return correct difference when the date is at the end of its day', () => {
    mockNow(2026, 3, 16, 12, 0, 0);
    const date = DateTime.utc(2026, 3, 14, 23, 59, 59);
    expect(dateService.differenceInDaysFromNow(date)).toBe(-2);
  });

  it('should return same result regardless of time-of-day for both now and date', () => {
    mockNow(2026, 3, 16, 0, 0, 0);
    const dateEnd = DateTime.utc(2026, 3, 18, 23, 59, 59);
    const resultFromStartOfNow = dateService.differenceInDaysFromNow(dateEnd);

    mockNow(2026, 3, 16, 23, 59, 59);
    const dateStart = DateTime.utc(2026, 3, 18, 0, 0, 0);
    const resultFromEndOfNow = dateService.differenceInDaysFromNow(dateStart);

    expect(resultFromStartOfNow).toBe(2);
    expect(resultFromEndOfNow).toBe(2);
  });
});
