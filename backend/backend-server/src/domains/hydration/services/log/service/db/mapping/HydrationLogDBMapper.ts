import { Injectable } from '@nestjs/common';
import {
  HydrationLog,
} from '@mealz/backend-hydration-log-service-api';

import { HydrationLogDBEntity } from '../entities';

@Injectable()
export class HydrationLogDBMapper {
  public toEntity(hydrationLog: HydrationLog): HydrationLogDBEntity {
    return {
      id: hydrationLog.id,
      user_id: hydrationLog.userId,
      glass_fraction: hydrationLog.glassFraction,
      logged_at: hydrationLog.loggedAt,
    };
  }

  public fromEntity(
    entity: HydrationLogDBEntity | undefined,
  ): HydrationLog | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      id: entity.id,
      userId: entity.user_id,
      glassFraction: entity.glass_fraction,
      loggedAt: entity.logged_at,
    };
  }
}
