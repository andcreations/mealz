import { URLBuilder } from '@andcreations/common';
import { arrayToQueryParam } from '@mealz/backend-gateway-api';

export const MEALS_USER_URL = '/api/meals/user';

export interface MealsUserAPIURL {
  readManyV1: (
    lastId: string | undefined,
    limit: number | undefined,
    userId: string,
    types: string[] | undefined,
  ) => string;
  upsertV1: () => string;
}

export class MealsUserAPI {
  static readonly url: MealsUserAPIURL = {
    /**
     * @method GET
     * @param lastId Identifier of the last read user meal (optional).
     * @param limit Number of user meals to read (optional).
     * @param userId User identifier.
     * @param types Types of user meal (optional).
     * @response ReadManyUserMealsGWResponseV1
     */
    readManyV1: (
      lastId: string | undefined,
      limit: number | undefined,
      userId: string,
      types: string[] | undefined,
    ) => {
      return URLBuilder.build(
        `${MEALS_USER_URL}/many/v1`,
        {
          lastId,
          limit,
          userId,
          types: arrayToQueryParam(types),
        },
      );
    },

    /**
     * @method POST
     * @request UpsertUserMealGWRequestV1
     * @response UpsertUserMealGWResponseV1
     */
    upsertV1: () => `${MEALS_USER_URL}/upsert/v1`,
  };
}