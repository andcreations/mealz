import { URLBuilder } from '@andcreations/common';

import {
  ReadNamedMealByIdQueryParamsV1,
  ReadNamedMealsFromLastQueryParamsV1,
  UpdateNamedMealV1QueryParams,
  DeleteNamedMealV1QueryParams,
} from './dtos';

export const MEALS_NAMED_V1_URL = '/api/v1/meals/named';

export interface MealsNamedV1APIURL {
  readByIdV1: (params: ReadNamedMealByIdQueryParamsV1) => string;
  readFromLastV1: (params: ReadNamedMealsFromLastQueryParamsV1) => string;
  createV1: () => string;
  updateV1: (params: UpdateNamedMealV1QueryParams) => string;
  deleteV1: (params: DeleteNamedMealV1QueryParams) => string;
}

export class MealsNamedV1API {
  public static readonly url: MealsNamedV1APIURL = {

    /**
     * @method GET
     * @param params Path parameters.
     * @response ReadNamedMealByIdGWResponseV1
     */
    readByIdV1: (params: ReadNamedMealByIdQueryParamsV1) => {
      return `${MEALS_NAMED_V1_URL}/one/${params.id}`;
    },

    /**
     * @method GET
     * @param params Query parameters.
     * @response ReadNamedMealsFromLastGWResponseV1
     */
    readFromLastV1: (params: ReadNamedMealsFromLastQueryParamsV1) => {
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
    updateV1: (params: UpdateNamedMealV1QueryParams) => {
      return `${MEALS_NAMED_V1_URL}/${params.id}`;
    },

    /**
     * @method DELETE
     * @param params Path parameters.
     */
    deleteV1: (params: DeleteNamedMealV1QueryParams) => {
      return `${MEALS_NAMED_V1_URL}/${params.id}`;
    },
  };
}