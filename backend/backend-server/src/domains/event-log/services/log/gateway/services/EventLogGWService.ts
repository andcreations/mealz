import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import {
  EventLogLevel,
  LogEventsRequestV1,
  EventLogTransporter,
  EventLogSource,
} from '@mealz/backend-event-log-service-api';
import { LogEventsGWRequestV1 } from '@mealz/backend-event-log-gateway-api';

@Injectable()
export class EventLogGWService {
  public constructor(
    private readonly eventLogLogTransporter: EventLogTransporter,
  ) {}

  public async logEventsV1(
    gwRequest: LogEventsGWRequestV1,
    gwUser: AuthUser,
    clientIp: string,
    userAgent: string,
    context: Context,
  ): Promise<void> {
    if (gwRequest.events.length === 0) {
      return;
    }

    const events = gwRequest.events.map(event => ({
      id: event.id,
      eventLevel: event.eventLevel as unknown as EventLogLevel,
      eventType: event.eventType,
      eventData: event.eventData,
      userId: gwUser.id,
      unknownUser: event.unknownUser,
      loggedAt: event.loggedAt,
      source: event.source as unknown as EventLogSource,
      clientIp,
      userAgent,
    }));
    const request: LogEventsRequestV1 = { events };
    await this.eventLogLogTransporter.logEventsV1(request, context);
  }
}
