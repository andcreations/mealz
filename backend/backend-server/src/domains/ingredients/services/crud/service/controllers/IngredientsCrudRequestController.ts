import { Context } from '@mealz/backend-core';
import { RequestHandler, RequestController } from '@mealz/backend-transport';
import {
  IngredientsCrudRequestTopics,
  ReadIngredientsFromLastRequestV1,
  ReadIngredientsFromLastResponseV1,
} from '@mealz/backend-ingredients-crud-service-api';

import { IngredientsCrudService } from '../services';

@RequestController()
export class IngredientsCrudRequestController {
  public constructor(
    private readonly ingredientsCrudService: IngredientsCrudService,
  ) {}

  @RequestHandler(IngredientsCrudRequestTopics.ReadFromLastV1)
  public async readFromLastV1(
    request: ReadIngredientsFromLastRequestV1,
    context: Context,
  ): Promise<ReadIngredientsFromLastResponseV1> {
    return this.ingredientsCrudService.readFromLastV1(request, context);
  }
}