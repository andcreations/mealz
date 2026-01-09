import {
  GWHydrationLog,
  ReadHydrationLogsByDateRangeGWResponseV1,
} from '@mealz/backend-hydration-log-gateway-api';

export class ReadHydrationLogsByDateRangeGWResponseV1Impl
  implements ReadHydrationLogsByDateRangeGWResponseV1
{
  public hydrationLogs: GWHydrationLog[];
}