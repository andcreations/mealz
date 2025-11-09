import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import { UserRole } from '@mealz/backend-api';
import { Auth, GWContext, GWUser, Roles } from '@mealz/backend-gateway-common';
import { MEALS_LOG_URL } from '@mealz/backend-meals-log-gateway-api';

import { MealsLogGWService } from '../services';
import {
  LogMealGWRequestV1Impl,
  LogMealGWResponseV1Impl,
  SummarizeMealLogQueryParamsV1,
  SummarizeMealLogResponseV1Impl,
} from '../dtos';

@Controller(MEALS_LOG_URL)
export class MealsLogGWController {
  public constructor(
    private readonly mealsLogGWService: MealsLogGWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Post('log-meal/v1')
  public async logMealV1(
    @Body() gwRequest: LogMealGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<LogMealGWResponseV1Impl> {
    await this.mealsLogGWService.logMealV1(gwRequest, gwUser.id, context);
    return {};
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('summarize/v1')
  public async summarizeMacrosV1(
    @Query() gwParams: SummarizeMealLogQueryParamsV1,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<SummarizeMealLogResponseV1Impl> {
    return this.mealsLogGWService.summarizeMacrosV1(
      gwParams,
      gwUser.id,
      context,
    );
  }
}