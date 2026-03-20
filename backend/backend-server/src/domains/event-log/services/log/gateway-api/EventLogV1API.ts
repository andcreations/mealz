export const EVENT_LOG_V1_URL = '/api/v1/event-log';

export interface EventLogV1APIURL {
  logEventV1: () => string;
}

export class EventLogV1API {
  public static readonly url: EventLogV1APIURL = {
    /**
     * @method POST
     * @request LogEventGWRequestV1
     * @response VoidTransporterResponse
     */
    logEventV1: () => `${EVENT_LOG_V1_URL}`,
  };
}
