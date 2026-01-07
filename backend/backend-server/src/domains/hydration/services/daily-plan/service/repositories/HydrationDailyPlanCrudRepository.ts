import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import {
  InjectDBRepository, 
  DBRepository, 
  Where, 
  Update,
} from '@mealz/backend-db';

import {
  HYDRATION_DAILY_PLAN_DB_NAME,
  HYDRATION_DAILY_PLAN_DB_ENTITY_NAME,
  HydrationDailyPlanDBEntity,
  HydrationDailyPlanDBMapper,
} from '../db';

@Injectable()
export class HydrationDailyPlanCrudRepository {
  public constructor(
    @InjectDBRepository(
      HYDRATION_DAILY_PLAN_DB_NAME,
      HYDRATION_DAILY_PLAN_DB_ENTITY_NAME,
    )
    private readonly repository: DBRepository<HydrationDailyPlanDBEntity>,
    private readonly mapper: HydrationDailyPlanDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}
}