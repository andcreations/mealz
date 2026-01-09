import { URLBuilder } from '@andcreations/common';

export const HYDRATION_DAILY_PLAN_V1_URL = '/api/v1/hydration/daily-plan';

export interface HydrationDailyPlanV1APIURL {
  createV1: () => string;
}

export class HydrationDailyPlanV1API {
  public static readonly url: HydrationDailyPlanV1APIURL = {
    /**
     * @method POST
     * @request CreateHydrationDailyPlanGWRequestV1
     * @response CreateHydrationDailyPlanGWResponseV1
     */
    createV1: () => `${HYDRATION_DAILY_PLAN_V1_URL}`,
  };
}