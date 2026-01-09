import { URLBuilder } from '@andcreations/common';
import { ReadIngredientsFromLastQueryParamsV1 } from './dtos';

export const INGREDIENTS_CRUD_V1_URL = '/api/v1/ingredients/crud';

export interface IngredientsCrudV1APIURL {
  readFromLastV1: (params: ReadIngredientsFromLastQueryParamsV1) => string;
}

export class IngredientsCrudV1API {
  static readonly url: IngredientsCrudV1APIURL = {
    /**
     * @method GET
     * @params IngredientsCrudV1APIReadFromLastParams
     * @response ReadIngredientsFromLastGWResponseV1
     */
    readFromLastV1: (params: ReadIngredientsFromLastQueryParamsV1) => {
      return URLBuilder.build(
        `${INGREDIENTS_CRUD_V1_URL}/from-last`,
        { ...params },
      );
    },
  };
}