import { URLBuilder } from '@andcreations/common';

export const INGREDIENTS_CRUD_V1_URL = '/api/v1/ingredients/crud';

export interface IngredientsCrudV1APIReadFromLastParams {
  // Identifier of the last read ingredient.
  lastId?: string;

  // Number of ingredients to read.
  limit?: number;
}

export interface IngredientsCrudV1APIURL {
  readFromLastV1: (params: IngredientsCrudV1APIReadFromLastParams) => string;
}

export class IngredientsCrudV1API {
  static readonly url: IngredientsCrudV1APIURL = {
    /**
     * @method GET
     * @params IngredientsCrudV1APIReadFromLastParams
     * @response ReadIngredientsFromLastGWResponseV1
     */
    readFromLastV1: (params: IngredientsCrudV1APIReadFromLastParams) => {
      return URLBuilder.build(
        `${INGREDIENTS_CRUD_V1_URL}/from-last`,
        { ...params },
      );
    },
  };
}