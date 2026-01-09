import { URLBuilder } from '@andcreations/common';
import { ReadMealDailyPlansQueryParamsV1 } from './dtos';

export const MEALS_DAILY_PLAN_V1_URL = '/api/v1/meals/daily-plan';

export interface MealsDailyPlanV1APIURL {
  readManyV1: (params: ReadMealDailyPlansQueryParamsV1) => string;
  createV1: () => string;
  updateV1: (mealDailyPlanId: string) => string;
}

export class MealsDailyPlanV1API {
  public static readonly url: MealsDailyPlanV1APIURL = {
    /**
     * @method GET
     * @param params Query parameters.
     * @response ReadMealDailyPlansGWResponseV1
     */
    readManyV1: (params: ReadMealDailyPlansQueryParamsV1) => {
      return URLBuilder.build(
        `${MEALS_DAILY_PLAN_V1_URL}/many`,
        { ...params },
      );
    },

    /**
     * @method POST
     * @request CreateMealDailyPlanGWRequestV1
     * @response CreateMealDailyPlanGWResponseV1
     */
    createV1: () => `${MEALS_DAILY_PLAN_V1_URL}`,

    /**
     * @method PUT
     * @request UpdateMealDailyPlanGWRequestV1
     * @response UpdateMealDailyPlanGWResponseV1
     */
    updateV1: (mealDailyPlanId: string) => {
      return `${MEALS_DAILY_PLAN_V1_URL}/${mealDailyPlanId}`;
    },
  };
}