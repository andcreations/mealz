import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import { UserRole } from '@mealz/backend-api';
import { Auth, GWContext, GWUser, Roles } from '@mealz/backend-gateway-common';
import {
  HYDRATION_DAILY_PLAN_V1_URL,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

import { 
  CreateHydrationDailyPlanGWRequestV1Impl,
  CreateHydrationDailyPlanGWResponseV1Impl,
} from '../dtos';
import { HydrationDailyPlanGWRequestV1Validator } from '../validators';
import { HydrationDailyPlanGWService } from '../services';

@Controller(HYDRATION_DAILY_PLAN_V1_URL)
export class HydrationDailyPlanGWController {
  public constructor(
    private readonly hydrationDailyPlanGWService: HydrationDailyPlanGWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Post('')
  public async createV1(
    @Body() gwRequest: CreateHydrationDailyPlanGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<CreateHydrationDailyPlanGWResponseV1Impl> {
    HydrationDailyPlanGWRequestV1Validator.validate(gwRequest);
    return await this.hydrationDailyPlanGWService.createV1(
      gwRequest,
      gwUser.id,
      context,
    );
  }
}