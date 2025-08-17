import { Controller, Get, Query } from '@nestjs/common';
import { UserRole } from '@mealz/backend-api';
import { Context } from '@mealz/backend-core';
import {
  Auth,
  GWContext,
  Roles,
} from '@mealz/backend-gateway-common';
import { MEALS_USER_URL } from '@mealz/backend-meals-user-gateway-api';

@Controller(MEALS_USER_URL)
export class MealsUserGWController {
  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('many/v1')
  public async readManyV1(
    @Query() gwParams: ReadFromLastV1GWQueryParams,
    @GWContext() context: Context,
  ): Promise<ReadIngredientsFromLastGWResponseV1> {
    return await this.ingredientsCrudGWService.readFromLast(gwParams, context);
  }
}