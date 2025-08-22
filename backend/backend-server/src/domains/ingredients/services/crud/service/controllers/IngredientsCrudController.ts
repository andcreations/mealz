import { Context } from '@mealz/backend-core';
import { RequestHandler, TransportController } from '@mealz/backend-transport';
import {
  IngredientsCrudTopics,
  ReadIngredientsFromLastRequestV1,
  ReadIngredientsFromLastResponseV1,
} from '@mealz/backend-ingredients-crud-service-api';

import { IngredientsCrudService } from '../services';

@TransportController()
export class IngredientsCrudController {
  public constructor(
    private readonly ingredientsCrudService: IngredientsCrudService,
  ) {}

  @RequestHandler(IngredientsCrudTopics.ReadFromLastV1)
  public async readFromLastV1(
    request: ReadIngredientsFromLastRequestV1,
    context: Context,
  ): Promise<ReadIngredientsFromLastResponseV1> {
    return this.ingredientsCrudService.readFromLastV1(request, context);
  }
}