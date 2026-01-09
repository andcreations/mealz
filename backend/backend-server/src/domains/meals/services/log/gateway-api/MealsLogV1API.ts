import { URLBuilder } from '@andcreations/common';

import {
  ReadMealLogsByDateRangeQueryParamsV1,
  SummarizeMealLogQueryParamsV1,
} from './dtos';

export const MEALS_LOG_V1_URL = '/api/v1/meals/log';

export interface MealsLogV1APIURL {
  logMealV1: () => string;
  summarizeV1: (params: SummarizeMealLogQueryParamsV1) => string;
  readByDateRangeV1: (params: ReadMealLogsByDateRangeQueryParamsV1) => string;
}

export class MealsLogV1API {
  static readonly url: MealsLogV1APIURL = {
    /**
     * @method POST
     * @request LogMealGWRequestV1
     * @response LogMealGWResponseV1
     */
    logMealV1: () => `${MEALS_LOG_V1_URL}`,

    /**
     * @method GET
     * @params MealsLogV1APISummarizeParams
     * @response SummarizeMealLogGWResponseV1
     */
    summarizeV1: (params: SummarizeMealLogQueryParamsV1) => {
      return URLBuilder.build(`${MEALS_LOG_V1_URL}/summary`, { ...params });
    },

    /**
     * @method GET
     * @params MealsLogV1APIReadByDateRangeParams
     * @response ReadMealLogsByDateRangeResponseV1
     */
    readByDateRangeV1: (params: ReadMealLogsByDateRangeQueryParamsV1) => {
      return URLBuilder.build(
        `${MEALS_LOG_V1_URL}/by-date-range`,
        { ...params },
      );
    },
  };
}