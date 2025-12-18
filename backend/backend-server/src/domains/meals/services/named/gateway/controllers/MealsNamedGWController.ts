import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserRole } from '@mealz/backend-api';
import { AuthUser } from '@mealz/backend-gateway-core';
import { Context } from '@mealz/backend-core';
import {
  Auth,
  GWContext,
  GWUser,
  Roles,
} from '@mealz/backend-gateway-common';
import {
  MEALS_NAMED_V1_URL,
  MealsNamedV1APIReadManyFromLastParams,
} from '@mealz/backend-meals-named-gateway-api';

import {
  CreateNamedMealGWRequestV1Impl,
  CreateNamedMealGWResponseV1Impl,
  ReadNamedMealByIdGWResponseV1Impl,
  ReadNamedMealsFromLastGWResponseV1Impl,
  UpdateNamedMealGWRequestV1Impl,
} from '../dtos';
import { MealsNamedPlanGWService } from '../services';

@Controller(MEALS_NAMED_V1_URL)
export class MealsNamedGWController {
  public constructor(
    private readonly mealsNamedPlanGWService: MealsNamedPlanGWService,
  ) {}


  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('one/:namedMealId')
  public async readByIdV1(
    @Param('namedMealId') namedMealId: string,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<ReadNamedMealByIdGWResponseV1Impl> {
    return await this.mealsNamedPlanGWService.readByIdV1(
      namedMealId,
      gwUser.id,
      context,
    );
  }

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

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Post('')
  public async createV1(
    @Body() gwRequest: CreateNamedMealGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<CreateNamedMealGWResponseV1Impl> {
    return await this.mealsNamedPlanGWService.createV1(
      gwRequest,
      gwUser.id,
      context,
    );
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Put('/:namedMealId')
  public async updateV1(
    @Param('namedMealId') namedMealId: string,
    @Body() gwRequest: UpdateNamedMealGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<void> {
    return await this.mealsNamedPlanGWService.updateV1(
      namedMealId,
      gwRequest,
      gwUser.id,
      context,
    );
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Delete('/:namedMealId')
  public async deleteV1(
    @Param('namedMealId') namedMealId: string,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<void> {
    return await this.mealsNamedPlanGWService.deleteV1(
      namedMealId,
      gwUser.id,
      context,
    );
  }
}