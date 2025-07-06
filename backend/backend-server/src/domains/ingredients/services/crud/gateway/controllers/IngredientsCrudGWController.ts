import { Controller, Get, Query } from '@nestjs/common';
import { UserRole } from '#mealz/backend-api';
import { Context } from '#mealz/backend-core';
import {
  Auth,
  GWContext,
  Roles,
} from '#mealz/backend-gateway-common';
import {
  INGREDIENTS_CRUD_URL,
  ReadManyIngredientsGWResponseV1,
} from '#mealz/backend-ingredients-crud-gateway-api';

import { ReadManyV1GWQueryParams } from '../dtos';
import { IngredientsCrudGWService } from '../services';

@Controller(INGREDIENTS_CRUD_URL)
export class IngredientsCrudGWController {
  public constructor(
    private readonly ingredientsCrudGWService: IngredientsCrudGWService,
  ) {}

  // @Auth()
  // @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('many/v1')
  public async readManyV1(
    @Query() gwParams: ReadManyV1GWQueryParams,
    @GWContext() context: Context,
  ): Promise<ReadManyIngredientsGWResponseV1> {
    return await this.ingredientsCrudGWService.readFromLast(gwParams, context);
  }
}