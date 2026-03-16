import { DateTime } from 'luxon';
import { Service } from '@andcreations/common';

import { SystemService } from './SystemService';

@Service()
export class DateService {
  private static readonly FINGERPRINT_FORMAT = 'yyyyLLdd';

  public constructor(
    private readonly systemService: SystemService,
  ) {}

  public getToday(): DateTime {
    const timeZone = this.systemService.getTimeZone();
    return DateTime.now().setZone(timeZone);
  }

  public getTomorrow(): DateTime {
    const timeZone = this.systemService.getTimeZone();
    return DateTime.now().setZone(timeZone).plus({ days: 1 });
  }

  public getTodayFromToDate(): { fromDate: number, toDate: number } {
    const timeZone = this.systemService.getTimeZone();
    const now = DateTime.now().setZone(timeZone);

    const fromDate = now.startOf('day').toMillis();
    const toDate = now.endOf('day').toMillis();

    return { fromDate, toDate };
  }

  public getTodayFingerprint(): string {
    const timeZone = this.systemService.getTimeZone();
    const now = DateTime.now().setZone(timeZone);
    return now.toFormat('yyyyLLdd');
  }

  public toFingerprint(day: number, month: number, year: number): string {
    return DateTime
      .local(year, month, day)
      .toFormat(DateService.FINGERPRINT_FORMAT);
  }

  public fingerprintToDate(
    fingerprint: string,
  ): DateTime {
    const date = DateTime.fromFormat(
      fingerprint, DateService.FINGERPRINT_FORMAT
    );
    return date;
  }

  public differenceInDaysFromNow(date: DateTime): number {
    const now = DateTime.now();
    return date.startOf('day').diff(now.startOf('day'), 'days').days;
  }
}