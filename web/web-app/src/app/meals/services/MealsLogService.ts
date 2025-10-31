import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';
import { 
  MealsLogAPI,
  LogMealGWRequestV1,
  LogMealGWResponseV1,
} from '@mealz/backend-meals-log-gateway-api';

@Service()
export class MealsLogService {
  public constructor(
    private readonly http: HTTPWebClientService,
  ) {}

  public async logMeal(meal: GWMealWithoutId): Promise<void> {
    await this.http.post<LogMealGWRequestV1, LogMealGWResponseV1>(
      MealsLogAPI.url.logMealV1(),
      { meal },
    );
  }
}