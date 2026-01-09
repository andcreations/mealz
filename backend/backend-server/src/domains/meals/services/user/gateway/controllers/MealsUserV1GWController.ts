import { 
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { UserRole } from '@mealz/backend-api';
import { Context } from '@mealz/backend-core';
import { AuthUser} from '@mealz/backend-gateway-core';
import {
  Auth,
  GWContext,
  GWUser,
  Roles,
} from '@mealz/backend-gateway-common';
import { MEALS_USER_V1_URL } from '@mealz/backend-meals-user-gateway-api';

import {
  ReadManyUserMealsQueryParamsV1Impl,
  ReadManyUserMealsGWResponseV1Impl,
  UpsertUserMealGWRequestV1Impl,
  UpsertUserMealGWResponseV1Impl,
} from '../dtos';
import { MealsUserV1GWService } from '../services';

@Controller(MEALS_USER_V1_URL)
export class MealsUserV1GWController {
  public constructor(
    private readonly mealsUserV1GWService: MealsUserV1GWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('many')
  public async readManyV1(
    @Query() gwParams: ReadManyUserMealsQueryParamsV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<ReadManyUserMealsGWResponseV1Impl> {
    return await this.mealsUserV1GWService.readManyV1(
      gwParams,
      gwUser.id,
      context,
    );
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Post('')
  public async upsertV1(
    @Body() gwRequest: UpsertUserMealGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<UpsertUserMealGWResponseV1Impl> {
    await this.mealsUserV1GWService.upsertV1(gwRequest, gwUser.id, context);
    return {};
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Delete('delete-by-type')
  public async deleteByTypeV1(
    @Query('typeId') typeId: string,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<void> {
    await this.mealsUserV1GWService.deleteByTypeV1(
      typeId,
      gwUser.id,
      context,
    );
  }
}