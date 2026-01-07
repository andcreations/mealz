import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  HydrationDailyPlanTransporter,
} from '@mealz/backend-hydration-daily-plan-service-api';

import { GWHydrationDailyPlanMapper } from './GWHydrationDailyPlanMapper';

@Injectable()
export class HydrationDailyPlanGWService {

  public constructor(
    private readonly hydrationDailyPlanTransporter: HydrationDailyPlanTransporter,
    private readonly gwHydrationDailyPlanMapper: GWHydrationDailyPlanMapper,
  ) {}
}