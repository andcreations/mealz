import { URLBuilder } from '@andcreations/common';
import { ReadHydrationDailyPlansQueryParamsV1 } from './dtos';

export const HYDRATION_DAILY_PLAN_V1_URL = '/api/v1/hydration/daily-plan';

export interface HydrationDailyPlanV1APIURL {
  readManyV1: (params: ReadHydrationDailyPlansQueryParamsV1) => string;
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
    readManyV1: (params: ReadHydrationDailyPlansQueryParamsV1) => {
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