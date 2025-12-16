import { URLBuilder } from '@andcreations/common';

export const MEALS_NAMED_V1_URL = '/api/v1/meals/named';

export interface MealsNamedV1APIReadManyFromLastParams {
  // Identifier of the last read named meal.
  lastId?: string;

  // Number of named meals to read.
  limit?: number;
}

export interface MealsNamedV1APIUpdateParams {
  id: string;
}

export interface MealsNamedV1APIURL {
  readFromLastV1: (params: MealsNamedV1APIReadManyFromLastParams) => string;
  createV1: () => string;
  updateV1: (params: MealsNamedV1APIUpdateParams) => string;
}

export class MealsNamedV1API {
  public static readonly url: MealsNamedV1APIURL = {
    /**
     * @param params Query parameters.
     * @response ReadNamedMealsFromLastGWResponseV1
     */
    readFromLastV1: (params: MealsNamedV1APIReadManyFromLastParams) => {
      return URLBuilder.build(
        `${MEALS_NAMED_V1_URL}/from-last`,
        { ...params },
      );
    },

    /**
     * @method POST
     * @request CreateNamedMealGWRequestV1
     * @response CreateNamedMealGWResponseV1
     */
    createV1: () => `${MEALS_NAMED_V1_URL}`,

    /**
     * @method PUT
     * @param params Path parameters.
     * @request UpdateNamedMealGWRequestV1
     */
    updateV1: (params: MealsNamedV1APIUpdateParams) => {
      return `${MEALS_NAMED_V1_URL}/${params.id}`;
    },
  };
}