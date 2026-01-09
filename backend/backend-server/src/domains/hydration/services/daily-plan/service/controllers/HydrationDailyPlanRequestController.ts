import { Context } from '@mealz/backend-core';
import {
  RequestController,
  RequestHandler,
} from '@mealz/backend-transport';
import {
  HydrationDailyPlanRequestTopics,
  CreateHydrationDailyPlanRequestV1,
  CreateHydrationDailyPlanResponseV1,
} from '@mealz/backend-hydration-daily-plan-service-api';

import { HydrationDailyPlanCrudService } from '../services';

@RequestController()
export class HydrationDailyPlanRequestController {
  public constructor(
    private readonly crudService: HydrationDailyPlanCrudService,
  ) {}

  @RequestHandler(HydrationDailyPlanRequestTopics.CreateHydrationDailyPlanV1)
  public async createHydrationDailyPlanV1(
    request: CreateHydrationDailyPlanRequestV1,
    context: Context,
  ): Promise<CreateHydrationDailyPlanResponseV1> {
    return this.crudService.createHydrationDailyPlanV1(request, context);
  }
}