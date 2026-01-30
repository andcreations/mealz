export const MEALS_AI_SCAN_V1_URL = '/api/v1/meals/ai-scan';

export interface MealsAIScanV1APIURL {
  scanV1: () => string;
}

export class MealsAIScanV1API {
  public static readonly url: MealsAIScanV1APIURL = {
    /**
     * @method POST
     * @request ScanPhotoGWRequestV1
     * @response ScanPhotoGWResponseV1
     */
    scanV1: () => `${MEALS_AI_SCAN_V1_URL}`,
  };
}