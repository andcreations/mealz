import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import { LogEventsRequestV1 } from '@mealz/backend-event-log-service-api';

@Injectable()
export class EventLogService {
  public constructor(
    private readonly logger: Logger,
  ) {}
  
  public async logEventsV1(
    request: LogEventsRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    const { events } = request;
    events.forEach(event => {
      this.logger.debug(`[event-log]`, {
        correlationId: context.correlationId,
        eventId: event.id,
        eventLevel: event.eventLevel,
        eventType: event.eventType,
        eventData: event.eventData,
        userId: event.userId,
        unknownUser: event.unknownUser,
        loggedAtTimestamp: event.loggedAt,
        loggedAt: new Date(event.loggedAt).toISOString(),
        source: event.source,
        clientIp: event.clientIp,
        userAgent: event.userAgent,
      });
    });
    return {};
  }
}
