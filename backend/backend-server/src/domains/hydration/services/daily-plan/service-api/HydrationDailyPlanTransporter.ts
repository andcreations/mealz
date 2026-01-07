import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  RequestTransporter,
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import {
  HYDRATION_DAILY_PLAN_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import { HydrationDailyPlanRequestTopics } from './HydrationDailyPlanRequestTopics';

@Injectable()
export class HydrationDailyPlanTransporter {
  public constructor(
    @Inject(HYDRATION_DAILY_PLAN_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}
}