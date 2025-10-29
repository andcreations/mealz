import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { UserRole } from '@mealz/backend-api';
import { Context } from '@mealz/backend-core';
import { AuthUser} from '@mealz/backend-gateway-core';
import {
  Auth,
  GWContext,
  GWUser,
  Roles,
} from '@mealz/backend-gateway-common';
import { MEALS_USER_URL } from '@mealz/backend-meals-user-gateway-api';

import {
  ReadManyUserMealsGWQueryParamsV1,
  ReadManyUserMealsGWResponseV1Impl,
  UpsertUserMealGWRequestV1Impl,
  UpsertUserMealGWResponseV1Impl,
} from '../dtos';
import { MealsUserGWService } from '../services';

@Controller(MEALS_USER_URL)
export class MealsUserGWController {
  public constructor(
    private readonly mealsUserGWService: MealsUserGWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('many/v1')
  public async readManyV1(
    @Query() gwParams: ReadManyUserMealsGWQueryParamsV1,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<ReadManyUserMealsGWResponseV1Impl> {
    return await this.mealsUserGWService.readMany(gwParams, gwUser.id, context);
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Post('upsert/v1')
  public async upsertV1(
    @Body() gwRequest: UpsertUserMealGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<UpsertUserMealGWResponseV1Impl> {
    await this.mealsUserGWService.upsert(gwRequest, gwUser.id, context);
    return {};
  }
}