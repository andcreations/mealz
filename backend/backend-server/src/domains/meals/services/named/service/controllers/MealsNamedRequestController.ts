import { Context } from '@mealz/backend-core';
import { 
  RequestController, 
  RequestHandler, 
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  CreateNamedMealRequestV1,
  CreateNamedMealResponseV1,
  DeleteNamedMealRequestV1,
  MealsNamedRequestTopics,
  ReadNamedMealByIdRequestV1,
  ReadNamedMealByIdResponseV1,
  ReadNamedMealsFromLastRequestV1,
  ReadNamedMealsFromLastResponseV1,
  UpdateNamedMealRequestV1,
  ShareNamedMealRequestV1,
  ShareNamedMealActionPayload,
  ListShareUsersResponseV1,
  ListShareUsersRequestV1,
} from '@mealz/backend-meals-named-service-api';

import { 
  MealsNamedCrudService,
  MealsNamedShareService,
  MealsNamedShareUsersService,
} from '../services';

@RequestController()
export class MealsDailyPlanRequestController {
  public constructor(
    private readonly mealsNamedCrudService: MealsNamedCrudService,
    private readonly mealsNamedService: MealsNamedShareService,
    private readonly mealsNamedShareUsersService: MealsNamedShareUsersService,
  ) {}

  @RequestHandler(MealsNamedRequestTopics.ReadNamedMealByIdV1)
  public async readNamedMealByIdV1(
    request: ReadNamedMealByIdRequestV1,
    context: Context,
  ): Promise<ReadNamedMealByIdResponseV1> {
    return this.mealsNamedCrudService.readNamedMealByIdV1(request, context);
  }

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
  ): Promise<VoidTransporterResponse> {
    return this.mealsNamedCrudService.updateNamedMealV1(request, context);
  }

  @RequestHandler(MealsNamedRequestTopics.DeleteNamedMealV1)
  public async deleteNamedMealV1(
    request: DeleteNamedMealRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.mealsNamedCrudService.deleteNamedMealV1(request, context);
  }

  @RequestHandler(MealsNamedRequestTopics.ShareNamedMealV1)
  public async shareNamedMealV1(
    request: ShareNamedMealRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.mealsNamedService.shareNamedMealV1(request, context);
  }

  @RequestHandler(MealsNamedRequestTopics.RunShareNamedMealActionV1)
  public async runShareNamedMealActionV1(
    request: ShareNamedMealActionPayload,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.mealsNamedService.runShareNamedMealActionV1(request, context);
  }

  @RequestHandler(MealsNamedRequestTopics.ListShareUsersV1)
  public async listShareUsersV1(
    request: ListShareUsersRequestV1,
    context: Context,
  ): Promise<ListShareUsersResponseV1> {
    return this.mealsNamedShareUsersService.listShareUsersV1(request, context);
  }
}