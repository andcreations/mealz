import { Injectable } from '@nestjs/common';
import {
  HydrationLog,
} from '@mealz/backend-hydration-log-service-api';

import { HydrationLogDBEntity } from '../entities';

@Injectable()
export class HydrationLogDBMapper {
  public toEntity(
    hydrationLog: Omit<HydrationLog, 'createdAt'>,
  ): Omit<HydrationLogDBEntity, 'createdAt'> {
    return {
      id: hydrationLog.id,
      user_id: hydrationLog.userId,
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
      createdAt: entity.createdAt,
    };
  }
}
