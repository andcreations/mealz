import { Injectable } from '@nestjs/common';
import { GWHydrationLog } from '@mealz/backend-hydration-log-gateway-api';
import { HydrationLog } from '@mealz/backend-hydration-log-service-api';

@Injectable()
export class GWHydrationLogMapper {
  public fromEntity(entity: HydrationLog): GWHydrationLog {
    return {
      id: entity.id,
      userId: entity.userId,
      glassFraction: entity.glassFraction,
      loggedAt: entity.loggedAt,
    };
  }
}