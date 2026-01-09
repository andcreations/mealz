import { Context } from '@mealz/backend-core';
import {
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  ReadManyHydrationDailyPlansResponseV1,
  ReadManyHydrationDailyPlansRequestV1,
  HydrationDailyPlanRequestTopics,
  CreateHydrationDailyPlanRequestV1,
  CreateHydrationDailyPlanResponseV1,
  UpdateHydrationDailyPlanRequestV1,
} from '@mealz/backend-hydration-daily-plan-service-api';

import { HydrationDailyPlanCrudService } from '../services';

@RequestController()
export class HydrationDailyPlanRequestController {
  public constructor(
    private readonly crudService: HydrationDailyPlanCrudService,
  ) {}

  @RequestHandler(HydrationDailyPlanRequestTopics.ReadManyHydrationDailyPlansV1)
  public async readManyHydrationDailyPlansV1(
    request: ReadManyHydrationDailyPlansRequestV1,
    context: Context,
  ): Promise<ReadManyHydrationDailyPlansResponseV1> {
    return this.crudService.readManyHydrationDailyPlansV1(request, context);
  }

  @RequestHandler(HydrationDailyPlanRequestTopics.CreateHydrationDailyPlanV1)
  public async createHydrationDailyPlanV1(
    request: CreateHydrationDailyPlanRequestV1,
    context: Context,
  ): Promise<CreateHydrationDailyPlanResponseV1> {
    return this.crudService.createHydrationDailyPlanV1(request, context);
  }

  @RequestHandler(HydrationDailyPlanRequestTopics.UpdateHydrationDailyPlanV1)
  public async updateHydrationDailyPlanV1(
    request: UpdateHydrationDailyPlanRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.crudService.updateHydrationDailyPlanV1(request, context);
  }
}