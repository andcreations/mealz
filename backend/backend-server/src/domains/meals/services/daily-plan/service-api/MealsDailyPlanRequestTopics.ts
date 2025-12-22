import { buildRequestTopic } from '@mealz/backend-transport';
import {
  MEALS_DAILY_PLAN_DOMAIN,
  MEALS_DAILY_PLAN_SERVICE,
} from './domain-and-service';

export class MealsDailyPlanRequestTopics {
  public static readonly ReadManyMealDailyPlansV1 = topic(
    'readManyMealDailyPlans',
    'v1',
  );
  public static readonly CreateMealDailyPlanV1 = topic(
    'createMealDailyPlan',
    'v1',
  );
  public static readonly UpdateMealDailyPlanV1 = topic(
    'updateMealDailyPlan',
    'v1',
  );
  public static readonly ReadUserCurrentMealDailyPlanV1 = topic(
    'readUserCurrentMealDailyPlan',
    'v1',
  );
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: MEALS_DAILY_PLAN_DOMAIN,
    service: MEALS_DAILY_PLAN_SERVICE,
    method,
    version,
  });
}
