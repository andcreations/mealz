import { Controller, Get, Query } from '@nestjs/common';
import { UserRole } from '@mealz/backend-api';
import { AuthUser } from '@mealz/backend-gateway-core';
import { Context } from '@mealz/backend-core';
import { Auth, GWContext, GWUser, Roles } from '@mealz/backend-gateway-common';
import {
  MEALS_NAMED_V1_URL,
  MealsNamedV1APIReadManyFromLastParams,
} from '@mealz/backend-meals-named-gateway-api';

import { ReadNamedMealsFromLastGWResponseV1Impl } from '../dtos';
import { MealsNamedPlanGWService } from '../services';

@Controller(MEALS_NAMED_V1_URL)
export class MealsNamedGWController {
  public constructor(
    private readonly mealsNamedPlanGWService: MealsNamedPlanGWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('from-last')
  public async readFromLastV1(
    @Query() gwParams: MealsNamedV1APIReadManyFromLastParams,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<ReadNamedMealsFromLastGWResponseV1Impl> {
    return await this.mealsNamedPlanGWService.readFromLastV1(
      gwParams,
      gwUser.id,
      context,
    );
  }
}