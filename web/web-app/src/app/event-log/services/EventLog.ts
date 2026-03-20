import { Service } from '@andcreations/common';
import * as uuid from 'uuid';

import { LogEvent, LogEventLevel } from '../types';
import { EventLogCollector } from './EventLogCollector';

@Service()
export class EventLog {
  public constructor(
    private readonly collector: EventLogCollector,
  ) { }
  
  public log(
    level: LogEventLevel,
    eventType: string,
    eventData?: object,
  ): void {
    const event: Omit<LogEvent, 'loggedAt' | 'unknownUser'> = {
      id: uuid.v7(),
      type: eventType,
      level,
      data: eventData ?? {},
    };
    this.collector.addEvent(event);
  }
}