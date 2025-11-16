import { Injectable } from '@nestjs/common';
import { LogMealResponseStatusV1  } from '@mealz/backend-meals-log-service-api';
import { LogMealGWResponseStatusV1 } from '@mealz/backend-meals-log-gateway-api';

@Injectable()
export class GWMealLogMapper {
  public fromStatus(
    status: LogMealResponseStatusV1,
  ): LogMealGWResponseStatusV1 {
    switch (status) {
      case LogMealResponseStatusV1.Created:
        return LogMealGWResponseStatusV1.Created;
      case LogMealResponseStatusV1.Updated:
        return LogMealGWResponseStatusV1.Updated;
    }
  }
}