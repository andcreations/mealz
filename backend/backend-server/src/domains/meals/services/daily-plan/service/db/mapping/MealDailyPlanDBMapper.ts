import { Injectable } from '@nestjs/common';
import { InternalError, MealzError } from '@mealz/backend-common';
import { MealDailyPlan } from '@mealz/backend-meals-daily-plan-service-api';

import { MealDailyPlanDetailsVersion } from '../../types';
import { MealDailyPlanDBEntity } from '../entities';
import { MealDailyPlanDetailsV1Mapper } from './MealDailyPlanDetailsV1Mapper';

@Injectable()
export class MealDailyPlanDBMapper {
  public constructor(
    private readonly mealDailyPlanDetailsV1Mapper: MealDailyPlanDetailsV1Mapper,
  ) {}

  public toEntity(
    mealDailyPlan: Omit<MealDailyPlan, 'createdAt'>,
  ): Omit<MealDailyPlanDBEntity, 'createdAt'> {
    return {
      id: mealDailyPlan.id,
      user_id: mealDailyPlan.userId,
      details_version: MealDailyPlanDetailsVersion.V1,
      details: this.mealDailyPlanDetailsV1Mapper.toBuffer(mealDailyPlan),
    };
  }

  public fromEntity(
    entity: MealDailyPlanDBEntity | undefined,
  ): MealDailyPlan | undefined {
    if (!entity) {
      return undefined;
    }
    if (entity.details_version === MealDailyPlanDetailsVersion.V1) {
      return this.fromDetailsV1(entity);
    }

    throw new InternalError(
      `Unknown meal daily plan details version ` +
      `${MealzError.quote(entity.details_version.toString())}`
    );
  }

  private fromDetailsV1(entity: MealDailyPlanDBEntity): MealDailyPlan {
    return {
      id: entity.id,
      userId: entity.user_id,
      createdAt: entity.createdAt,
      ...this.mealDailyPlanDetailsV1Mapper.fromBuffer(entity.details),
    };
  }
}
