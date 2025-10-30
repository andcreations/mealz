import { Context } from '@mealz/backend-core';
import { RequestHandler, RequestController } from '@mealz/backend-transport';
import {
  ReadMealByIdRequestV1,
  ReadMealByIdResponseV1,
  ReadMealsByIdRequestV1,
  ReadMealsByIdResponseV1,
  CreateMealRequestV1,
  CreateMealResponseV1,
  MealsCrudRequestTopics,
  UpsertMealRequestV1,
  UpsertMealResponseV1,
  DeleteMealByIdRequestV1,
} from '@mealz/backend-meals-crud-service-api';

import { MealsCrudService } from '../services';

@RequestController()
export class MealsCrudRequestController {
  public constructor(private readonly mealsCrudService: MealsCrudService) {
  }

  @RequestHandler(MealsCrudRequestTopics.ReadMealByIdV1)
  public async readMealByIdV1(
    request: ReadMealByIdRequestV1,
    context: Context,
  ): Promise<ReadMealByIdResponseV1> {
    return this.mealsCrudService.readMealByIdV1(request, context);
  }

  @RequestHandler(MealsCrudRequestTopics.ReadMealsByIdV1)
  public async readMealsByIdV1(
    request: ReadMealsByIdRequestV1,
    context: Context,
  ): Promise<ReadMealsByIdResponseV1> {
    return this.mealsCrudService.readMealsByIdV1(request, context);
  }

  @RequestHandler(MealsCrudRequestTopics.CreateMealV1)
  public async createMealV1(
    request: CreateMealRequestV1,
    context: Context,
  ): Promise<CreateMealResponseV1> {
    return this.mealsCrudService.createMealV1(request, context);
  }

  @RequestHandler(MealsCrudRequestTopics.UpsertMealV1)
  public async upsertMealV1(
    request: UpsertMealRequestV1,
    context: Context,
  ): Promise<UpsertMealResponseV1> {
    return this.mealsCrudService.upsertMealV1(request, context);
  }

  @RequestHandler(MealsCrudRequestTopics.DeleteMealByIdV1)
  public async deleteMealByIdV1(
    request: DeleteMealByIdRequestV1,
    context: Context,
  ): Promise<void> {
    return this.mealsCrudService.deleteMealByIdV1(request, context);
  }
}