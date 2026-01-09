import { URLBuilder } from '@andcreations/common';
import { ReadHydrationLogsByDateRangeQueryParamsV1 } from './dtos';

export const HYDRATION_LOG_V1_URL = '/api/v1/hydration/log';

export interface HydrationLogV1APIURL {
  logHydrationV1: () => string;
  readByDateRangeV1: (
    params: ReadHydrationLogsByDateRangeQueryParamsV1,
  ) => string;
}

export class HydrationLogV1API {
  public static readonly url: HydrationLogV1APIURL = {
    /**
     * @method POST
     * @request LogHydrationGWRequestV1
     */
    logHydrationV1: () => `${HYDRATION_LOG_V1_URL}`,

    /**
     * @method GET
     * @params HydrationLogV1APIReadByDateRangeParams
     * @response ReadHydrationLogsByDateRangeGWResponseV1
     */
    readByDateRangeV1: (params: ReadHydrationLogsByDateRangeQueryParamsV1) => {
      return URLBuilder.build(
        `${HYDRATION_LOG_V1_URL}/by-date-range`,
        { ...params },
      );
    },
  };
}