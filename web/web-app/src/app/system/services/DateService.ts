import { DateTime } from 'luxon';
import { Service } from '@andcreations/common';

import { SystemService } from './SystemService';

@Service()
export class DateService {
  public constructor(
    private readonly systemService: SystemService,
  ) {}

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
}