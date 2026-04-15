import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserRole } from '@mealz/backend-api';
import { Context } from '@mealz/backend-core';
import {
  Auth,
  AuthSystemAdmin,
  GWContext,
  Roles,
} from '@mealz/backend-gateway-common';
import {
  INGREDIENTS_CRUD_V1_URL,
  ReadIngredientsFromLastGWResponseV1,
} from '@mealz/backend-ingredients-crud-gateway-api';

import { 
  ReadIngredientsFromLastGWQueryParamsV1Impl,
  UpsertIngredientsGWRequestV1Impl,
} from '../dtos';
import { IngredientsCrudV1GWService } from '../services';

@Controller(INGREDIENTS_CRUD_V1_URL)
export class IngredientsCrudV1GWController {
  public constructor(
    private readonly ingredientsCrudV1GWService: IngredientsCrudV1GWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('from-last')
  public async readFromLastV1(
    @Query() gwParams: ReadIngredientsFromLastGWQueryParamsV1Impl,
    @GWContext() context: Context,
  ): Promise<ReadIngredientsFromLastGWResponseV1> {
    return await this.ingredientsCrudV1GWService.readFromLastV1(
      gwParams,
      context,
    );
  }

  @AuthSystemAdmin()
  @Get('admin/from-last')
  public async readFromLastV1Admin(
    @Query() gwParams: ReadIngredientsFromLastGWQueryParamsV1Impl,
    @GWContext() context: Context,
  ): Promise<ReadIngredientsFromLastGWResponseV1> {
    return await this.ingredientsCrudV1GWService.readFromLastV1(
      gwParams,
      context,
    );
  } 

  @AuthSystemAdmin()
  @Post('admin/upsert')
  public async upsertIngredientsV1Admin(
    @Body() gwRequest: UpsertIngredientsGWRequestV1Impl,
    @GWContext() context: Context,
  ): Promise<void> {
    return await this.ingredientsCrudV1GWService.upsertIngredientsV1(
      gwRequest,
      context,
    );
  }
}