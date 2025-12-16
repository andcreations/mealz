import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  MealsNamedV1APIReadManyFromLastParams,
} from '@mealz/backend-meals-named-gateway-api';
import {
  CreateNamedMealRequestV1,
  MealsNamedTransporter,
  ReadNamedMealsFromLastRequestV1,
  UpdateNamedMealRequestV1,
} from '@mealz/backend-meals-named-service-api';

import {
  CreateNamedMealGWRequestV1Impl,
  CreateNamedMealGWResponseV1Impl,
  ReadNamedMealsFromLastGWResponseV1Impl,
  UpdateNamedMealGWRequestV1Impl,
} from '../dtos';
import { GWNamedMealMapper } from './GWNamedMealMapper';

@Injectable()
export class MealsNamedPlanGWService {
  public constructor(
    private readonly mealsNamedTransporter: MealsNamedTransporter,
    private readonly gwNamedMealMapper: GWNamedMealMapper,
  ) {}

  public async readFromLastV1(
    gwParams: MealsNamedV1APIReadManyFromLastParams,
    userId: string,
    context: Context,
  ): Promise<ReadNamedMealsFromLastGWResponseV1Impl> {
    const request: ReadNamedMealsFromLastRequestV1 = {
      userId,
      lastId: gwParams.lastId,
      limit: gwParams.limit,
    };
    const {
      namedMeals,
    } = await this.mealsNamedTransporter.readNamedMealsFromLastV1(
      request,
      context,
    );
    return { namedMeals: this.gwNamedMealMapper.fromNamedMeals(namedMeals) };
  }

  public async createV1(
    gwRequest: CreateNamedMealGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<CreateNamedMealGWResponseV1Impl> {
    const request: CreateNamedMealRequestV1 = {
      userId,
      meal: gwRequest.meal,
      mealName: gwRequest.mealName,
    };
    const { id } = await this.mealsNamedTransporter.createNamedMealV1(
      request,
      context,
    );
    return { id };
  }

  public async updateV1(
    namedMealId: string,
    gwRequest: UpdateNamedMealGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<void> {
    const request: UpdateNamedMealRequestV1 = {
      namedMealId,
      userId,
      meal: gwRequest.meal,
      mealName: gwRequest.mealName,
    };
    await this.mealsNamedTransporter.updateNamedMealV1(
      request,
      context,
    );
  }
}