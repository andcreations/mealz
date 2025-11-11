import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import { UserRole } from '@mealz/backend-api';
import { Auth, GWContext, GWUser, Roles } from '@mealz/backend-gateway-common';
import {
  MEALS_DAILY_PLAN_V1_URL,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import {
  CreateMealDailyPlanGWRequestV1Impl,
  CreateMealDailyPlanGWResponseV1Impl,
  MealsDailyPlanV1APIReadManyParamsImpl,
  ReadMealDailyPlansGWResponseV1Impl,
  UpdateMealDailyPlanGWRequestV1Impl,
  UpdateMealDailyPlanGWResponseV1Impl,
} from '../dtos';
import { CreateMealDailyPlanGWRequestV1Validator } from '../validators';
import { MealsDailyPlanGWService } from '../services';

@Controller(MEALS_DAILY_PLAN_V1_URL)
export class MealsDailyPlanGWController {
  public constructor(
    private readonly mealsDailyPlanGWService: MealsDailyPlanGWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('many')
  public async readManyV1(
    @Query() gwParams: MealsDailyPlanV1APIReadManyParamsImpl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<ReadMealDailyPlansGWResponseV1Impl> {
    return await this.mealsDailyPlanGWService.readManyV1(
      gwParams,
      gwUser.id,
      context,
    );
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Post('create')
  public async createV1(
    @Body() gwRequest: CreateMealDailyPlanGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<CreateMealDailyPlanGWResponseV1Impl> {
    CreateMealDailyPlanGWRequestV1Validator.validate(gwRequest);
    return await this.mealsDailyPlanGWService.createV1(
      gwRequest,
      gwUser.id,
      context,
    );
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Put('/:mealDailyPlanId')
  public async updateV1(
    @Param('mealDailyPlanId') mealDailyPlanId: string,
    @Body() gwRequest: UpdateMealDailyPlanGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<UpdateMealDailyPlanGWResponseV1Impl> {
    CreateMealDailyPlanGWRequestV1Validator.validate(gwRequest);
    return await this.mealsDailyPlanGWService.updateV1(
      mealDailyPlanId,
      gwRequest,
      gwUser.id,
      context,
    );
  }
}