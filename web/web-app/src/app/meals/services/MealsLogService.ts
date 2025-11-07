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

  public async summarize(
    fromDate: number,
    toDate: number,
  ): Promise<GWMacrosSummary> {
    const { data } = await this.http.get<SummarizeMealLogResponseV1>(
      MealsLogAPI.url.summarizeV1({ fromDate, toDate }),
    );
    return data.summary;
  }

  public async summarizeToday(): Promise<GWMacrosSummary> {
    const timeZone = this.systemService.getTimeZone();
    const now = DateTime.now().setZone(timeZone);

    const fromDate = now.startOf('day').toMillis();
    const toDate = now.endOf('day').toMillis();
    Log.debug(
      `Summarizing today's meal log from ` +
      `${new Date(fromDate).toISOString()} to ` +
      `${new Date(toDate).toISOString()}`
    );

    return this.summarize(fromDate, toDate);
  }
}