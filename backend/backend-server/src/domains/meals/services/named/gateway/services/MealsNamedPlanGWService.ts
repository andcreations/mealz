import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { DEFAULT_READ_LIMIT } from '@mealz/backend-common';
import { GWMealMapper } from '@mealz/backend-meals-gateway-common';
import {
  MealsCrudTransporter,
  ReadMealByIdRequestV1,
} from '@mealz/backend-meals-crud-service-api';
import {
  MealsNamedV1APIReadManyFromLastParams,
} from '@mealz/backend-meals-named-gateway-api';
import {
  CreateNamedMealRequestV1,
  DeleteNamedMealRequestV1,
  MealsNamedTransporter,
  ReadNamedMealByIdRequestV1,
  ReadNamedMealsFromLastRequestV1,
  UpdateNamedMealRequestV1,
} from '@mealz/backend-meals-named-service-api';

import {
  CreateNamedMealGWRequestV1Impl,
  CreateNamedMealGWResponseV1Impl,
  ReadNamedMealByIdGWResponseV1Impl,
  ReadNamedMealsFromLastGWResponseV1Impl,
  UpdateNamedMealGWRequestV1Impl,
} from '../dtos';
import { GWNamedMealMapper } from './GWNamedMealMapper';

@Injectable()
export class MealsNamedPlanGWService {
  public constructor(
    private readonly mealsNamedTransporter: MealsNamedTransporter,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly gwNamedMealMapper: GWNamedMealMapper,
    private readonly gwMealMapper: GWMealMapper,
  ) {}

  public async readByIdV1(
    namedMealId: string,
    userId: string,
    context: Context,
  ): Promise<ReadNamedMealByIdGWResponseV1Impl> {
    const namedMealRequest: ReadNamedMealByIdRequestV1 = {
      id: namedMealId,
      userId,
    };
    const { namedMeal } = await this.mealsNamedTransporter.readNamedMealByIdV1(
      namedMealRequest,
      context,
    );

    const mealRequest: ReadMealByIdRequestV1 = {
      id: namedMeal.mealId,
    };
    const { meal } = await this.mealsCrudTransporter.readMealByIdV1(
      mealRequest,
      context,
    );

    return {
      namedMeal: this.gwNamedMealMapper.fromNamedMeal(namedMeal),
      meal: this.gwMealMapper.fromMeal(meal),
    };
  }

  public async readFromLastV1(
    gwParams: MealsNamedV1APIReadManyFromLastParams,
    userId: string,
    context: Context,
  ): Promise<ReadNamedMealsFromLastGWResponseV1Impl> {
    const request: ReadNamedMealsFromLastRequestV1 = {
      userId,
      lastId: gwParams.lastId,
      limit: gwParams.limit ?? DEFAULT_READ_LIMIT,
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

  public async deleteV1(
    namedMealId: string,
    userId: string,
    context: Context,
  ): Promise<void> {
    const request: DeleteNamedMealRequestV1 = {
      id: namedMealId,
      userId,
    };
    await this.mealsNamedTransporter.deleteNamedMealV1(request, context);
  }
}