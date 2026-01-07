import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import { UserRole } from '@mealz/backend-api';
import { Auth, GWContext, GWUser, Roles } from '@mealz/backend-gateway-common';
import {
  HYDRATION_DAILY_PLAN_V1_URL,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

import { HydrationDailyPlanGWService } from '../services';

@Controller(HYDRATION_DAILY_PLAN_V1_URL)
export class HydrationDailyPlanGWController {
  public constructor(
    private readonly hydrationDailyPlanGWService: HydrationDailyPlanGWService,
  ) {}
}