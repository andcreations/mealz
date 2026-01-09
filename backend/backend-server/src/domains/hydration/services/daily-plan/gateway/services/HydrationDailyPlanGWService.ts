import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  CreateHydrationDailyPlanRequestV1,
  HydrationDailyPlanTransporter,
} from '@mealz/backend-hydration-daily-plan-service-api';

import {
  CreateHydrationDailyPlanGWRequestV1Impl,
  CreateHydrationDailyPlanGWResponseV1Impl,
} from '../dtos';
import { GWHydrationDailyPlanMapper } from './GWHydrationDailyPlanMapper';

@Injectable()
export class HydrationDailyPlanGWService {

  public constructor(
    private readonly hydrationDailyPlanTransporter:
      HydrationDailyPlanTransporter,
    private readonly gwHydrationDailyPlanMapper:
      GWHydrationDailyPlanMapper,
  ) {}

  public async createV1(
    gwRequest: CreateHydrationDailyPlanGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<CreateHydrationDailyPlanGWResponseV1Impl> {
    const request: CreateHydrationDailyPlanRequestV1 = {
      hydrationDailyPlan: this
        .gwHydrationDailyPlanMapper
        .fromGWHydrationDailyPlanForCreation(
          userId,
          gwRequest.hydrationDailyPlan,
        ),
      };
    const { id } = await this
      .hydrationDailyPlanTransporter
      .createHydrationDailyPlanV1(
        request,
        context,
      );
    return { id };
  }
}