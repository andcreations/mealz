import { Service } from '@andcreations/common';

import { Log } from '../Log';
import { LogEvent } from '../types';

@Service()
export class EventLogCollector {
  private static readonly EVENT_COUNT_TO_FLUSH = 100;

  private readonly pendingEvents: LogEvent[] = [];
  private flushing = false;

  public addEvent(event: LogEvent): void {
    this.pendingEvents.push(event);
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
        Log.info(
          `Dropping pending event logs, count: ${this.pendingEvents.length}`,
        );
      }
      this.pendingEvents.length = 0;
      return;
    }

    try {
      // copy & clear so that other event logs can be added
      const events = [...this.pendingEvents];
      this.pendingEvents.length = 0;

      // send
      await this.sendEvents(events);
    } catch (error) {
      Log.error(`Failed to flush event log`);
    } finally {
      this.flushing = false;
    } 
  }

  private async sendEvents(events: LogEvent[]): Promise<void> {
    console.log('Sending event log');
    events.forEach(event => {
      console.log(JSON.stringify(event));
    });
  }
}