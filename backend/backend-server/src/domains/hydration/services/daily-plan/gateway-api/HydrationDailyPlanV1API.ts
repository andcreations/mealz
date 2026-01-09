import { URLBuilder } from '@andcreations/common';

export const HYDRATION_DAILY_PLAN_V1_URL = '/api/v1/hydration/daily-plan';

export interface HydrationDailyPlanV1APIReadManyParams {
  limit?: number;
}

export interface HydrationDailyPlanV1APIURL {
  readManyV1: (params: HydrationDailyPlanV1APIReadManyParams) => string;
  createV1: () => string;
  updateV1: (hydrationDailyPlanId: string) => string;
}

export class HydrationDailyPlanV1API {
  public static readonly url: HydrationDailyPlanV1APIURL = {
    /**
     * @method GET
     * @param params Query parameters.
     * @response ReadHydrationDailyPlansGWResponseV1
     */
    readManyV1: (params: HydrationDailyPlanV1APIReadManyParams) => {
      return URLBuilder.build(
        `${HYDRATION_DAILY_PLAN_V1_URL}/many`,
        { ...params },
      );
    },

    /**
     * @method POST
     * @request CreateHydrationDailyPlanGWRequestV1
     * @response CreateHydrationDailyPlanGWResponseV1
     */
    createV1: () => `${HYDRATION_DAILY_PLAN_V1_URL}`,

    /**
     * @method PUT
     * @request UpdateHydrationDailyPlanGWRequestV1
     * @response UpdateHydrationDailyPlanGWResponseV1
     */
    updateV1: (hydrationDailyPlanId: string) => {
      return `${HYDRATION_DAILY_PLAN_V1_URL}/${hydrationDailyPlanId}`;
    },
  };
}