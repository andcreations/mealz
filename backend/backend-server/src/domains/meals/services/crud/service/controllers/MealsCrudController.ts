import { Context } from '@mealz/backend-core';
import { RequestHandler, TransportController } from '@mealz/backend-transport';
import {
  ReadMealByIdRequestV1,
  ReadMealByIdResponseV1,
  ReadMealsByIdRequestV1,
  ReadMealsByIdResponseV1,
  CreateMealRequestV1,
  CreateMealResponseV1,
  MealsCrudTopics,
  UpsertMealRequestV1,
  UpsertMealResponseV1,
  DeleteMealByIdRequestV1,
} from '@mealz/backend-meals-crud-service-api';

import { MealsCrudService } from '../services';

@TransportController()
export class MealsCrudController {
  public constructor(private readonly mealsCrudService: MealsCrudService) {
  }

  @RequestHandler(MealsCrudTopics.ReadMealByIdV1)
  public async readMealByIdV1(
    request: ReadMealByIdRequestV1,
    context: Context,
  ): Promise<ReadMealByIdResponseV1> {
    return this.mealsCrudService.readMealByIdV1(request, context);
  }

  @RequestHandler(MealsCrudTopics.ReadMealsByIdV1)
  public async readMealsByIdV1(
    request: ReadMealsByIdRequestV1,
    context: Context,
  ): Promise<ReadMealsByIdResponseV1> {
    return this.mealsCrudService.readMealsByIdV1(request, context);
  }

  @RequestHandler(MealsCrudTopics.CreateMealV1)
  public async createMealV1(
    request: CreateMealRequestV1,
    context: Context,
  ): Promise<CreateMealResponseV1> {
    return this.mealsCrudService.createMealV1(request, context);
  }

  @RequestHandler(MealsCrudTopics.UpsertMealV1)
  public async upsertMealV1(
    request: UpsertMealRequestV1,
    context: Context,
  ): Promise<UpsertMealResponseV1> {
    return this.mealsCrudService.upsertMealV1(request, context);
  }

  @RequestHandler(MealsCrudTopics.DeleteMealByIdV1)
  public async deleteMealByIdV1(
    request: DeleteMealByIdRequestV1,
    context: Context,
  ): Promise<void> {
    return this.mealsCrudService.deleteMealByIdV1(request, context);
  }
}