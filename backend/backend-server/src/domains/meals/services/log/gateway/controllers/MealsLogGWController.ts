import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import { UserRole } from '@mealz/backend-api';
import { Auth, GWContext, GWUser, Roles } from '@mealz/backend-gateway-common';
import { MEALS_LOG_V1_URL } from '@mealz/backend-meals-log-gateway-api';

import { MealsLogGWService } from '../services';
import {
  LogMealGWRequestV1Impl,
  LogMealGWResponseV1Impl,
  ReadMealLogsByDateRangeQueryParamsV1,
  ReadMealLogsByDateRangeGWResponseV1Impl,
  SummarizeMealLogParamsV1Impl,
  SummarizeMealLogResponseV1Impl,
} from '../dtos';

@Controller(MEALS_LOG_V1_URL)
export class MealsLogGWController {
  public constructor(
    private readonly mealsLogGWService: MealsLogGWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Post()
  public async logMealV1(
    @Body() gwRequest: LogMealGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<LogMealGWResponseV1Impl> {
    return this.mealsLogGWService.logMealV1(gwRequest, gwUser.id, context);
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('by-date-range')
  public async readByDateRangeV1(
    @Query() gwParams: ReadMealLogsByDateRangeQueryParamsV1,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<ReadMealLogsByDateRangeGWResponseV1Impl> {
    ReadMealLogsByDateRangeQueryParamsV1.validate(gwParams);
    return this.mealsLogGWService.readByDateRangeV1(
      gwParams,
      gwUser.id,
      context,
    );
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('summary')
  public async summarizeMacrosV1(
    @Query() gwParams: SummarizeMealLogParamsV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<SummarizeMealLogResponseV1Impl> {
    SummarizeMealLogParamsV1Impl.validate(gwParams);
    return this.mealsLogGWService.summarizeMacrosV1(
      gwParams,
      gwUser.id,
      context,
    );
  }
}