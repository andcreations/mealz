import {
  ReadHydrationDailyPlansGWResponseV1,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

import { GWHydrationDailyPlanImpl } from '../types';

export class ReadHydrationDailyPlansGWResponseV1Impl
  implements ReadHydrationDailyPlansGWResponseV1
{
  // Hydration daily plans
  hydrationDailyPlans: GWHydrationDailyPlanImpl[];
}