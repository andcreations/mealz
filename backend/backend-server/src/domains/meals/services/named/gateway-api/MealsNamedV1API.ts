import { URLBuilder } from '@andcreations/common';

export const MEALS_NAMED_V1_URL = '/api/v1/meals/named';

export interface MealsNamedV1APIReadManyFromLastParams {
  // Identifier of the last read named meal.
  lastId?: string;

  // Number of named meals to read.
  limit?: number;
}

export interface MealsNamedV1APIURL {
  readFromLastV1: (params: MealsNamedV1APIReadManyFromLastParams) => string;
}

export class MealsNamedV1API {
  public static readonly url: MealsNamedV1APIURL = {
    readFromLastV1: (params: MealsNamedV1APIReadManyFromLastParams) => {
      return URLBuilder.build(
        `${MEALS_NAMED_V1_URL}/from-last`,
        { ...params },
      );
    },
  };
}