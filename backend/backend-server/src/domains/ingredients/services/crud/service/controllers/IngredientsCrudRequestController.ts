import { Context } from '@mealz/backend-core';
import { RequestHandler, RequestController } from '@mealz/backend-transport';
import {
  IngredientsCrudRequestTopics,
  ReadIngredientsByIdRequestV1,
  ReadIngredientsByIdResponseV1,
  ReadIngredientsFromLastRequestV1,
  ReadIngredientsFromLastResponseV1,
} from '@mealz/backend-ingredients-crud-service-api';

import { IngredientsCrudService } from '../services';

@RequestController()
export class IngredientsCrudRequestController {
  public constructor(
    private readonly ingredientsCrudService: IngredientsCrudService,
  ) {}


  @RequestHandler(IngredientsCrudRequestTopics.ReadIngredientsByIdV1)
  public async readIngredientsByIdV1(
    request: ReadIngredientsByIdRequestV1,
    context: Context,
  ): Promise<ReadIngredientsByIdResponseV1> {
    return this.ingredientsCrudService.readIngredientsByIdV1(request, context);
  }

  @RequestHandler(IngredientsCrudRequestTopics.ReadIngredientsFromLastV1)
  public async readIngredientsFromLastV1(
    request: ReadIngredientsFromLastRequestV1,
    context: Context,
  ): Promise<ReadIngredientsFromLastResponseV1> {
    return this.ingredientsCrudService.readIngredientsFromLastV1(
      request,
      context,
    );
  }
}