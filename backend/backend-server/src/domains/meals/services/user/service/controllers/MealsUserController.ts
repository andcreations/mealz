import { Context } from '@mealz/backend-core';
import { RequestHandler, TransportController } from '@mealz/backend-transport';
import {
  MealsUserTopics,
  CreateUserMealRequestV1,
  CreateUserMealResponseV1,
  UpsertUserMealRequestV1,
} from '@mealz/backend-meals-user-service-api';

import { MealsUserService } from '../services';

@TransportController()
export class MealsUserController {
  public constructor(private readonly mealsUserService: MealsUserService) {
  }

  @RequestHandler(MealsUserTopics.CreateUserMealV1)
  public async createUserMealV1(
    request: CreateUserMealRequestV1,
    context: Context,
  ): Promise<CreateUserMealResponseV1> {
    return this.mealsUserService.createUserMealV1(request, context);
  }

  @RequestHandler(MealsUserTopics.UpsertUserMealV1)
  public async upsertUserMealV1(
    request: UpsertUserMealRequestV1,
    context: Context,
  ): Promise<void> {
    return this.mealsUserService.upsertUserMealV1(request, context);
  }
}