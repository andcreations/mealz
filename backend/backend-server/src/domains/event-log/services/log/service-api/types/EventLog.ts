import { EventLogLevel } from './EventLogLevel';
import { EventLogSource } from './EventLogSource';

export interface EventLog {
  id: string;
  userId: string;
  unknownUser: boolean;
  loggedAt: number;
  eventLevel: EventLogLevel;
  eventType: string;
  eventData: object;
  source: EventLogSource;
  clientIp: string;
  userAgent: string;
}