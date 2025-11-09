import { DateTime } from 'luxon';
import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';
import { 
  GWMacrosSummary,
  LogMealGWRequestV1,
  LogMealGWResponseV1,
  SummarizeMealLogResponseV1,
  MealsLogAPI,
} from '@mealz/backend-meals-log-gateway-api';

import { SystemService } from '../../system';
import { Log } from '../../log';
import { GWMacrosSummaryWithDayOfWeek } from '../types';

@Service()
export class MealsLogService {
  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly systemService: SystemService,
  ) {}

  public async logMeal(meal: GWMealWithoutId): Promise<void> {
    await this.http.post<LogMealGWRequestV1, LogMealGWResponseV1>(
      MealsLogAPI.url.logMealV1(),
      { meal },
    );
  }

  private async summarize(
    fromDate: number,
    toDate: number,
  ): Promise<GWMacrosSummary> {
    const { data } = await this.http.get<SummarizeMealLogResponseV1>(
      MealsLogAPI.url.summarizeV1({ fromDate, toDate }),
    );
    return data.summary;
  }

  private getTodayFromToDate(): { fromDate: number, toDate: number } {
    const timeZone = this.systemService.getTimeZone();
    const now = DateTime.now().setZone(timeZone);

    const fromDate = now.startOf('day').toMillis();
    const toDate = now.endOf('day').toMillis();

    return { fromDate, toDate };
  }

  public async fetchTodaySummary(): Promise<GWMacrosSummary> {
    const { fromDate, toDate } = this.getTodayFromToDate();
    Log.debug(
      `Summarizing today's meal log from ` +
      `${new Date(fromDate).toISOString()} to ` +
      `${new Date(toDate).toISOString()}`
    );

    return this.summarize(fromDate, toDate);
  }

  public async fetchWeeklySummary(): Promise<GWMacrosSummaryWithDayOfWeek[]> {
    const DAYS_COUNT = 7;
    
    const timeZone = this.systemService.getTimeZone();
    const summaries: GWMacrosSummaryWithDayOfWeek[] = [];

    // summarize the days
    for (let index = 0; index < DAYS_COUNT; index++) {
      const date = DateTime.now().setZone(timeZone).minus({ days: index });
      const dayOfWeek = date.toFormat('ccc');

      const fromDate = date.startOf('day').toMillis();
      const toDate = date.endOf('day').toMillis();

      const summary = await this.summarize(fromDate, toDate);
      summaries.push({
        ...summary,
        dayOfWeek,
      });
    }

    // changes the order from the oldest to the newest day
    return summaries.reverse();
  }
}