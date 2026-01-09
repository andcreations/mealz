import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  RequestTransporter,
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import {
  HYDRATION_DAILY_PLAN_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import { 
  HydrationDailyPlanRequestTopics,
 } from './HydrationDailyPlanRequestTopics';
import { 
  CreateHydrationDailyPlanRequestV1,
  CreateHydrationDailyPlanResponseV1,
  UpdateHydrationDailyPlanRequestV1,
} from './dtos';

@Injectable()
export class HydrationDailyPlanTransporter {
  public constructor(
    @Inject(HYDRATION_DAILY_PLAN_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async createHydrationDailyPlanV1(
    request: CreateHydrationDailyPlanRequestV1,
    context: Context,
  ): Promise<CreateHydrationDailyPlanResponseV1> {
    return this.transporter.sendRequest<
      CreateHydrationDailyPlanRequestV1, CreateHydrationDailyPlanResponseV1
    >(
      HydrationDailyPlanRequestTopics.CreateHydrationDailyPlanV1,
      request, context,
    );
  }

  public async updateHydrationDailyPlanV1(
    request: UpdateHydrationDailyPlanRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      UpdateHydrationDailyPlanRequestV1, VoidTransporterResponse
    >(
      HydrationDailyPlanRequestTopics.UpdateHydrationDailyPlanV1,
      request, context,
    );
  }
}