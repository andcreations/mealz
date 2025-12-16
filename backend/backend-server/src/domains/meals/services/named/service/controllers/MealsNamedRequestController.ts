import { Context } from '@mealz/backend-core';
import { RequestController, RequestHandler } from '@mealz/backend-transport';
import {
  CreateNamedMealRequestV1,
  CreateNamedMealResponseV1,
  MealsNamedRequestTopics,
  ReadNamedMealsFromLastRequestV1,
  ReadNamedMealsFromLastResponseV1,
  UpdateNamedMealRequestV1,
} from '@mealz/backend-meals-named-service-api';

import { MealsNamedCrudService } from '../services';

@RequestController()
export class MealsDailyPlanRequestController {
  public constructor(
    private readonly mealsNamedCrudService: MealsNamedCrudService,
  ) {}

  @RequestHandler(MealsNamedRequestTopics.ReadNamedMealsFromLastV1)
  public async readNamedMealsFromLastV1(
    request: ReadNamedMealsFromLastRequestV1,
    context: Context,
  ): Promise<ReadNamedMealsFromLastResponseV1> {
    return this.mealsNamedCrudService.readNamedMealsFromLastV1(
      request,
      context,
    );
  }

  @RequestHandler(MealsNamedRequestTopics.CreateNamedMealV1)
  public async createNamedMealV1(
    request: CreateNamedMealRequestV1,
    context: Context,
  ): Promise<CreateNamedMealResponseV1> {
    return this.mealsNamedCrudService.createNamedMealV1(request, context);
  }

  @RequestHandler(MealsNamedRequestTopics.UpdateNamedMealV1)
  public async updateNamedMealV1(
    request: UpdateNamedMealRequestV1,
    context: Context,
  ): Promise<void> {
    return this.mealsNamedCrudService.updateNamedMealV1(request, context);
  }
}