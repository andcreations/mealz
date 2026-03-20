import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { 
  LogEventsGWRequestV1,
  EventLogV1API,
  GWEventLogLevel,
  GWEventLogSource,
} from '@mealz/backend-event-log-gateway-api';

// import the
import { AuthUserService } from '../../auth/services/AuthUserService';
import { LogEvent, LogEventLevel } from '../types';
import { v7 } from 'uuid';

@Service()
export class EventLogCollector {
  private static readonly EVENT_COUNT_TO_FLUSH = 4;

  private readonly pendingEvents: LogEvent[] = [];
  private flushing = false;

  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly authUserService: AuthUserService,
  ) {}

  public addEvent(event: Omit<LogEvent, 'loggedAt' | 'unknownUser'>): void {
    this.pendingEvents.push({
      ...event,
      loggedAt: Date.now(),
      unknownUser: !this.authUserService.isSignedIn(),
    });
    this.tryTriggerFlush();
  }

  private tryTriggerFlush(): void {
    if (this.pendingEvents.length < EventLogCollector.EVENT_COUNT_TO_FLUSH) {
      return;
    }
    void this.triggerFlush();
  }

  private async triggerFlush(): Promise<void> {
    if (this.flushing === true) {
      // if we're not able to send quicker then the event logs are added,
      // then simply drop the pending events
      if (this.pendingEvents.length > 0) {
        console.log(
          `Dropping pending event logs, count: ${this.pendingEvents.length}`,
        );
      }
      this.pendingEvents.length = 0;
      return;
    }

    console.log(`Flushing event logs`);
    try {
      // copy & clear so that other event logs can be added
      const events = [...this.pendingEvents];
      this.pendingEvents.length = 0;

      // send
      await this.sendEvents(events);
    } catch (error) {
      console.log(`Failed to flush event log`);
    } finally {
      this.flushing = false;
    } 
  }

  private async sendEvents(events: LogEvent[]): Promise<void> {
    console.log(`Sending event logs`);
    const request: LogEventsGWRequestV1 = {
      events: events.map(event => ({
        id: event.id,
        eventLevel: this.mapLevel(event.level),
        eventType: event.type,
        eventData: event.data,
        loggedAt: event.loggedAt,
        unknownUser: event.unknownUser,
        source: GWEventLogSource.Web,
      })),
    };
    await this.http.post<LogEventsGWRequestV1, void>(
      EventLogV1API.url.logEventV1(),
      request,
    );
  }

  private mapLevel(level: LogEventLevel): GWEventLogLevel {
    switch (level) {
      case 'debug':
        return GWEventLogLevel.Debug;
      case 'info':
        return GWEventLogLevel.Info;
      case 'error':
        return GWEventLogLevel.Error;
    }
  }
}