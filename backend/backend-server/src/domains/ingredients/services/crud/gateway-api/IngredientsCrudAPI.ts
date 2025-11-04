import { URLBuilder } from '@andcreations/common';

export const INGREDIENTS_CRUD_URL = '/api/ingredients/crud';

export interface IngredientsCrudAPIReadFromLastV1Params {
  // Identifier of the last read ingredient.
  lastId?: string;

  // Number of ingredients to read.
  limit?: number;
}

export interface IngredientsCrudAPIURL {
  readFromLastV1: (params: IngredientsCrudAPIReadFromLastV1Params) => string;
}

export class IngredientsCrudAPI {
  static readonly url: IngredientsCrudAPIURL = {
    /**
     * @method GET
     * @params IngredientsCrudAPIReadFromLastV1Params
     * @response ReadIngredientsFromLastGWResponseV1
     */
    readFromLastV1: (params: IngredientsCrudAPIReadFromLastV1Params) => {
      return URLBuilder.build(
        `${INGREDIENTS_CRUD_URL}/from-last/v1`,
        { ...params },
      );
    },
  };
}