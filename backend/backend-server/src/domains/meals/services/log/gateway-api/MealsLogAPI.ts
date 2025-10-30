export const MEALS_LOG_URL = '/api/meals/log';

export interface MealsLogAPIURL {
  logMealV1: () => string;
}

export class MealsLogAPI {
  static readonly url: MealsLogAPIURL = {
    /**
     * @method POST
     * @request LogMealGWRequestV1
     * @response LogMealGWResponseV1
     */
    logMealV1: () => `${MEALS_LOG_URL}/log-meal/v1`,
  };
}