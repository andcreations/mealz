import {
  ReadMealDailyPlansGWResponseV1,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { GWMealDailyPlanImpl } from '../types';

export class ReadMealDailyPlansGWResponseV1Impl
  implements ReadMealDailyPlansGWResponseV1
{
  // Meal daily plans
  mealDailyPlans: GWMealDailyPlanImpl[];
}