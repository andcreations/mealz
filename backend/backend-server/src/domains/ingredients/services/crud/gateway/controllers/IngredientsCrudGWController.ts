import { Controller, Get, Query } from '@nestjs/common';
import { UserRole } from '@mealz/backend-api';
import { Context } from '@mealz/backend-core';
import {
  Auth,
  GWContext,
  Roles,
} from '@mealz/backend-gateway-common';
import {
  INGREDIENTS_CRUD_URL,
  ReadIngredientsFromLastGWResponseV1,
} from '@mealz/backend-ingredients-crud-gateway-api';

import { ReadIngredientsFromLastGWQueryParamsV1 } from '../dtos';
import { IngredientsCrudGWService } from '../services';

@Controller(INGREDIENTS_CRUD_URL)
export class IngredientsCrudGWController {
  public constructor(
    private readonly ingredientsCrudGWService: IngredientsCrudGWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('from-last/v1')
  public async readFromLastV1(
    @Query() gwParams: ReadIngredientsFromLastGWQueryParamsV1,
    @GWContext() context: Context,
  ): Promise<ReadIngredientsFromLastGWResponseV1> {
    return await this.ingredientsCrudGWService.readFromLast(gwParams, context);
  }
}