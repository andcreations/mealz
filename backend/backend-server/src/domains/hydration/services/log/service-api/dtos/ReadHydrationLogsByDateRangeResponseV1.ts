import { HydrationLog } from '../types';

export interface ReadHydrationLogsByDateRangeResponseV1 {
  // Hydration logs
  hydrationLogs: HydrationLog[];
}