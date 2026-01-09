import { URLBuilder } from '@andcreations/common';

export const MEALS_LOG_V1_URL = '/api/v1/meals/log';

export interface SummarizeMealLogParamsV1 {
  // Date from which to summarize the meal logs
  fromDate: number;

  // Date to which to summarize the meal logs
  toDate: number;
}

export interface ReadMealLogsByDateRangeParamsV1 {
  // Date from which to read the meal logs
  fromDate: number;

  // Date to which to read the meal logs
  toDate: number;
}

export interface MealsLogV1APIURL {
  logMealV1: () => string;
  summarizeV1: (params: SummarizeMealLogParamsV1) => string;
  readByDateRangeV1: (params: ReadMealLogsByDateRangeParamsV1) => string;
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
     * @response SummarizeMealLogResponseV1
     */
    summarizeV1: (params: SummarizeMealLogParamsV1) => {
      return URLBuilder.build(`${MEALS_LOG_V1_URL}/summary`, { ...params });
    },

    /**
     * @method GET
     * @params MealsLogV1APIReadByDateRangeParams
     * @response ReadMealLogsByDateRangeResponseV1
     */
    readByDateRangeV1: (params: ReadMealLogsByDateRangeParamsV1) => {
      return URLBuilder.build(
        `${MEALS_LOG_V1_URL}/by-date-range`,
        { ...params },
      );
    },
  };
}