import { GWHydrationLog } from './GWHydrationLog';

export type GWHydrationLogForCreation = Omit<GWHydrationLog, 
  | 'id'
  | 'loggedAt'
>;