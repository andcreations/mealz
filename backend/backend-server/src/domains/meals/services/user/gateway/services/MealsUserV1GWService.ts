import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { ifDefined } from '@mealz/backend-shared';
import {
  ReadManyUserMealsRequestV1,
  MealsUserTransporter,
  UpsertUserMealRequestV1,
  DeleteUserMealRequestV1,
} from '@mealz/backend-meals-user-service-api';
import {
  ReadManyUserMealsGWResponseV1,
  UpsertUserMealGWRequestV1,
  UpsertUserMealGWResponseV1,
} from '@mealz/backend-meals-user-gateway-api';

import { MealsUserV1APIReadManyParamsImpl } from '../dtos';
import { GWUserMealMapper } from './GWUserMealMapper';

@Injectable()
export class MealsUserV1GWService {
  public constructor(
    private readonly mealsUserTransporter: MealsUserTransporter,
    private readonly gwUserMealMapper: GWUserMealMapper,
  ) {}

  public async readManyV1(
    gwParams: MealsUserV1APIReadManyParamsImpl,
    userId: string,
    context: Context
  ): Promise<ReadManyUserMealsGWResponseV1> {
    const request: ReadManyUserMealsRequestV1 = {
      userId,
      limit: gwParams.limit,
      ...ifDefined<ReadManyUserMealsRequestV1>('lastId', gwParams.lastId),
      ...ifDefined<ReadManyUserMealsRequestV1>('typeIds', gwParams.typeIds),
    };
    const response = await this.mealsUserTransporter.readManyV1(
      request,
      context,
    );
    const userMeals = await this.gwUserMealMapper.fromUserMeals(
      response.userMeals,
      context,
    );
    return { userMeals };
  }

  public async upsertV1(
    gwRequest: UpsertUserMealGWRequestV1,
    userId: string,
    context: Context,
  ): Promise<UpsertUserMealGWResponseV1> {
    const request: UpsertUserMealRequestV1 = {
      ...ifDefined<UpsertUserMealRequestV1>('id', gwRequest.id),
      userId,
      typeId: gwRequest.typeId,
      meal: gwRequest.meal,
    };
    await this.mealsUserTransporter.upsertUserMealV1(request, context);
    return {};
  }

  public async deleteByTypeV1(
    typeId: string,
    userId: string,
    context: Context,
  ): Promise<void> {
    const request: DeleteUserMealRequestV1 = { userId, typeId };
    await this.mealsUserTransporter.deleteUserMealV1(request, context);
  }
}