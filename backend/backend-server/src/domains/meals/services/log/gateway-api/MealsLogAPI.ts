import { URLBuilder } from '@andcreations/common';

export const MEALS_LOG_URL = '/api/meals/log';

export interface MealsLogAPISummarizeV1Params {
  // Date from which to summarize the meal logs
  fromDate: number;

  // Date to which to summarize the meal logs
  toDate: number;
}

export interface MealsLogAPIURL {
  logMealV1: () => string;
  summarizeV1: (params: MealsLogAPISummarizeV1Params) => string;
}

export class MealsLogAPI {
  static readonly url: MealsLogAPIURL = {
    /**
     * @method POST
     * @request LogMealGWRequestV1
     * @response LogMealGWResponseV1
     */
    logMealV1: () => `${MEALS_LOG_URL}/log-meal/v1`,

    /**
     * @method GET
     * @params MealsLogAPISummarizeV1Params
     * @response SummarizeMealLogResponseV1
     */
    summarizeV1: (params: MealsLogAPISummarizeV1Params) => {
      return URLBuilder.build(`${MEALS_LOG_URL}/summarize/v1`, { ...params });
    },
  };
}