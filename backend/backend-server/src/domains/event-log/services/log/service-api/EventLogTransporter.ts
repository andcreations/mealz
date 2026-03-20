import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  RequestTransporter,
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import {
  EVENT_LOG_LOG_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import { EventLogRequestTopics } from './EventLogRequestTopics';
import { LogEventsRequestV1 } from './dtos';

export class EventLogTransporter {
  public constructor(
    @Inject(EVENT_LOG_LOG_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async logEventsV1(
    request: LogEventsRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      LogEventsRequestV1, VoidTransporterResponse
    >(
      EventLogRequestTopics.LogEventsV1,
      request, context,
    );
  }
}
