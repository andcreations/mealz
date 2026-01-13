import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import {
  GWGlassFraction,
  sumGlassFractions,
  HydrationLogV1API,
  GWHydrationLog,
  ReadHydrationLogsByDateRangeGWResponseV1,
  LogHydrationGWRequestV1,
} from '@mealz/backend-hydration-log-gateway-api';

@Service()
export class HydrationLogService {
  public constructor(
    private readonly http: HTTPWebClientService,
  ) {}

  public async readByDateRange(
    fromDate: number,
    toDate: number,
  ): Promise<GWHydrationLog[]> {
    const { data } = await this.http.get<
      ReadHydrationLogsByDateRangeGWResponseV1
    >(
      HydrationLogV1API.url.readByDateRangeV1({ fromDate, toDate }),
    );
    return data.hydrationLogs;
  }

  public sumGlassesFromLogs(logs: GWHydrationLog[]): number {
    return sumGlassFractions(logs.map(log => log.glassFraction));
  }

  private async logHydration(glassFraction: GWGlassFraction): Promise<void> {
    const request: LogHydrationGWRequestV1 = {
      glassFraction,
    };
    await this.http.post<LogHydrationGWRequestV1, void>(
      HydrationLogV1API.url.logHydrationV1(),
      request,
    );
  }

  public async logFullGlass(): Promise<void> {
    await this.logHydration('full');
  }
}