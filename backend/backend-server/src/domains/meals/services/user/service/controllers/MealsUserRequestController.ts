import { Context } from '@mealz/backend-core';
import { RequestHandler, RequestController } from '@mealz/backend-transport';
import {
  MealsUserRequestTopics,
  ReadManyUserMealsRequestV1,
  ReadManyUserMealsResponseV1,
  CreateUserMealRequestV1,
  CreateUserMealResponseV1,
  UpsertUserMealRequestV1,
  UpsertUserMealResponseV1,
  DeleteUserMealResponseV1,
  DeleteUserMealRequestV1,
} from '@mealz/backend-meals-user-service-api';

import { MealsUserService } from '../services';

@RequestController()
export class MealsUserRequestController {
  public constructor(private readonly mealsUserService: MealsUserService) {
  }

  @RequestHandler(MealsUserRequestTopics.ReadManyUserMealsV1)
  public async readManyUserMealsV1(
    request: ReadManyUserMealsRequestV1,
    context: Context,
  ): Promise<ReadManyUserMealsResponseV1> {
    return this.mealsUserService.readManyUserMealsV1(request, context);
  }

  @RequestHandler(MealsUserRequestTopics.CreateUserMealV1)
  public async createUserMealV1(
    request: CreateUserMealRequestV1,
    context: Context,
  ): Promise<CreateUserMealResponseV1> {
    return this.mealsUserService.createUserMealV1(request, context);
  }

  @RequestHandler(MealsUserRequestTopics.UpsertUserMealV1)
  public async upsertUserMealV1(
    request: UpsertUserMealRequestV1,
    context: Context,
  ): Promise<UpsertUserMealResponseV1> {
    return this.mealsUserService.upsertUserMealV1(request, context);
  }

  @RequestHandler(MealsUserRequestTopics.DeleteUserMealV1)
  public async deleteUserMealV1(
    request: DeleteUserMealRequestV1,
    context: Context,
  ): Promise<DeleteUserMealResponseV1> {
    return this.mealsUserService.deleteUserMealV1(request, context);
  }
}