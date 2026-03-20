import { GWEventLogLevel } from './GWEventLogLevel';
import { GWEventLogSource } from './GWEventLogSource';

export interface GWEventLog {
  id: string;
  eventLevel: GWEventLogLevel;
  eventType: string;
  eventData?: object;
  loggedAt: number;
  unknownUser: boolean;
  source: GWEventLogSource;
}
