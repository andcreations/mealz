import { URLBuilder } from '@andcreations/common';

export const INGREDIENTS_CRUD_URL = '/api/ingredients/crud';

export interface IngredientsCrudAPIURL {
  readFromLastV1: (lastId?: string, limit?: number) => string;
}

export class IngredientsCrudAPI {
  static readonly url: IngredientsCrudAPIURL = {
    /**
     * @method GET
     * @param lastId Identifier of the last ingredient read.
     * @param limit Number of ingredients to read.
     * @response ReadIngredientsFromLastGWResponseV1
     */
    readFromLastV1: (lastId?: string, limit?: number) => {
      return URLBuilder.build(
        `${INGREDIENTS_CRUD_URL}/from-last/v1`,
        {
          lastId,
          limit,
        },
      );
    },
  };
}