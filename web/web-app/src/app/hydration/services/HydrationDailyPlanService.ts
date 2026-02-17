import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { 
  GWHydrationDailyPlan,
  HydrationDailyPlanV1API,
  ReadHydrationDailyPlansGWResponseV1,
  GWHydrationDailyPlanForCreation,
  CreateHydrationDailyPlanGWRequestV1,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

@Service()
export class HydrationDailyPlanService {
  public constructor(
    private readonly http: HTTPWebClientService,
  ) {}

  public async readCurrentDailyPlan(
  ): Promise<GWHydrationDailyPlan | undefined> {
    const { data } = await this.http.get<ReadHydrationDailyPlansGWResponseV1>(
      HydrationDailyPlanV1API.url.readManyV1({ limit: 1 }),
    );
    return data.hydrationDailyPlans[0];
  }

  public async createDailyPlan(
    hydrationDailyPlan: GWHydrationDailyPlanForCreation,
  ): Promise<void> {
    const request: CreateHydrationDailyPlanGWRequestV1 = {
      hydrationDailyPlan,
    };
    await this.http.post<CreateHydrationDailyPlanGWRequestV1>(
      HydrationDailyPlanV1API.url.createV1(),
      request,
    );
  }
}