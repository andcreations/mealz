import { URLBuilder } from '@andcreations/common';
import { ifDefined } from '@mealz/backend-shared';
import { arrayToQueryParam } from '@mealz/backend-gateway-api';

import { ReadManyUserMealsQueryParamsV1 } from './dtos';

export const MEALS_USER_V1_URL = '/api/v1/meals/user';

export interface MealsUserV1APIURL {
  readManyV1: (params: ReadManyUserMealsQueryParamsV1) => string;
  upsertV1: () => string;
  deleteByTypeV1: (typeId: string) => string;
}

export class MealsUserV1API {
  static readonly url: MealsUserV1APIURL = {
    /**
     * @method GET
     * @param params Query parameters.
     * @response ReadManyUserMealsGWResponseV1
     */
    readManyV1: (params: ReadManyUserMealsQueryParamsV1) => {
      return URLBuilder.build(
        `${MEALS_USER_V1_URL}/many`,
        {
          ...ifDefined('lastId', params.lastId),
          ...ifDefined('limit', params.limit),
          ...ifDefined('typeIds', arrayToQueryParam(params.typeIds)),
        },
      );
    },

    /**
     * @method POST
     * @request UpsertUserMealGWRequestV1
     * @response UpsertUserMealGWResponseV1
     */
    upsertV1: () => `${MEALS_USER_V1_URL}`,

    /**
     * @method DELETE
     * @param typeId Type of user meal.
     */
    deleteByTypeV1: (typeId: string) => {
      return URLBuilder.build(
        `${MEALS_USER_V1_URL}/delete-by-type`,
        { typeId },
      );
    },
  };
}