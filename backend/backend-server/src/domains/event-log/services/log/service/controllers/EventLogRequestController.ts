import { Context } from '@mealz/backend-core';
import {
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  LogEventsRequestV1,
  EventLogRequestTopics,
} from '@mealz/backend-event-log-service-api';

import { EventLogService } from '../services';

@RequestController()
export class EventLogRequestController {
  public constructor(
    private readonly eventLogLogService: EventLogService,
  ) {}

  @RequestHandler(EventLogRequestTopics.LogEventsV1)
  public async logEventsV1(
    request: LogEventsRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.eventLogLogService.logEventsV1(request, context);
  }
}
