import { GWHydrationLog } from './GWHydrationLog';

export type GWHydrationLogForUpdate = Omit<GWHydrationLog, 
  | 'id'
  | 'createdAt'
>;