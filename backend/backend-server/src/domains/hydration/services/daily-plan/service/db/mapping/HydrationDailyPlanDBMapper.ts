import { Injectable } from '@nestjs/common';
import { InternalError, MealzError } from '@mealz/backend-common';
import {
  HydrationDailyPlan,
} from '@mealz/backend-hydration-daily-plan-service-api';

import { HydrationDailyPlanDetailsVersion } from '../../types';
import { HydrationDailyPlanDBEntity } from '../entities';
import {
  HydrationDailyPlanDetailsV1Mapper,
} from './HydrationDailyPlanDetailsV1Mapper';

@Injectable()
export class HydrationDailyPlanDBMapper {
  public constructor(
    private readonly detailsV1Mapper: HydrationDailyPlanDetailsV1Mapper,
  ) {}

  public toEntity(
    hydrationDailyPlan: Omit<HydrationDailyPlan, 'createdAt'>,
  ): Omit<HydrationDailyPlanDBEntity, 'createdAt'> {
    return {
      id: hydrationDailyPlan.id,
      user_id: hydrationDailyPlan.userId,
      details_version: HydrationDailyPlanDetailsVersion.V1,
      details: this.detailsV1Mapper.toBuffer(hydrationDailyPlan),
    };
  }

  public fromEntity(
    entity: HydrationDailyPlanDBEntity | undefined,
  ): HydrationDailyPlan | undefined {
    if (!entity) {
      return undefined;
    }
    if (entity.details_version === HydrationDailyPlanDetailsVersion.V1) {
      return this.fromDetailsV1(entity);
    }

    throw new InternalError(
      `Unknown hydration daily plan details version ` +
      `${MealzError.quote(entity.details_version.toString())}`
    );
  }

  private fromDetailsV1(
    entity: HydrationDailyPlanDBEntity,
  ): HydrationDailyPlan {
    return {
      id: entity.id,
      userId: entity.user_id,
      createdAt: entity.createdAt,
      ...this.detailsV1Mapper.fromBuffer(entity.details),
    };
  }
}
