import { URLBuilder } from '@andcreations/common';

export const MEALS_LOG_V1_URL = '/api/v1/meals/log';

export interface MealsLogV1APISummarizeParams {
  // Date from which to summarize the meal logs
  fromDate: number;

  // Date to which to summarize the meal logs
  toDate: number;
}

export interface MealsLogV1APIURL {
  logMealV1: () => string;
  summarizeV1: (params: MealsLogV1APISummarizeParams) => string;
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
    summarizeV1: (params: MealsLogV1APISummarizeParams) => {
      return URLBuilder.build(`${MEALS_LOG_V1_URL}/summary`, { ...params });
    },
  };
}