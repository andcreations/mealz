import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { ifDefined } from '@mealz/backend-shared';
import {
  ReadManyUserMealsRequestV1,
  MealsUserTransporter,
  UpsertUserMealRequestV1,
} from '@mealz/backend-meals-user-service-api';
import {
  ReadManyUserMealsGWResponseV1,
  UpsertUserMealGWRequestV1,
  UpsertUserMealGWResponseV1,
} from '@mealz/backend-meals-user-gateway-api';

import { ReadManyUserMealsGWQueryParamsV1 } from '../dtos';
import { GWUserMealMapper } from './GWUserMealMapper';

@Injectable()
export class MealsUserGWService {
  public constructor(
    private readonly mealsUserTransporter: MealsUserTransporter,
    private readonly gwUserMealMapper: GWUserMealMapper,
  ) {}

  public async readMany(
    gwParams: ReadManyUserMealsGWQueryParamsV1,
    userId: string,
    context: Context
  ): Promise<ReadManyUserMealsGWResponseV1> {
    const request: ReadManyUserMealsRequestV1 = {
      userId,
      limit: gwParams.limit,
      ...ifDefined<ReadManyUserMealsRequestV1>('lastId', gwParams.lastId),
      ...ifDefined<ReadManyUserMealsRequestV1>('types', gwParams.types),
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

  public async upsert(
    gwRequest: UpsertUserMealGWRequestV1,
    userId: string,
    context: Context,
  ): Promise<UpsertUserMealGWResponseV1> {
    const request: UpsertUserMealRequestV1 = {
      ...ifDefined<UpsertUserMealRequestV1>('id', gwRequest.id),
      userId,
      type: gwRequest.type,
      meal: gwRequest.meal,
    };

    return null;
  }
}