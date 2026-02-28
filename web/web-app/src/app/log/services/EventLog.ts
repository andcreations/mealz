import { Service } from '@andcreations/common';
import { v7 } from 'uuid';

import { EventLogCollector } from './EventLogCollector';
import { LogEvent, LogEventLevel } from '../types';

@Service()
export class EventLog {
  public constructor(private readonly collector: EventLogCollector) {
  }
  
  public log(
    level: LogEventLevel,
    eventType: string,
    eventData?: object,
  ): void {
    const event: LogEvent = {
      id: v7(),
      type: eventType,
      level,
      data: eventData ?? {},
      createdAt: Date.now(),
    };
    this.collector.addEvent(event);
  }
}