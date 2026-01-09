import { buildRequestTopic } from '@mealz/backend-transport';
import {
  HYDRATION_DAILY_PLAN_DOMAIN,
  HYDRATION_DAILY_PLAN_SERVICE,
} from './domain-and-service';

export class HydrationDailyPlanRequestTopics {
  public static readonly CreateHydrationDailyPlanV1 = topic(
    'createHydrationDailyPlan',
    'v1',
  );
  public static readonly UpdateHydrationDailyPlanV1 = topic(
    'updateHydrationDailyPlan',
    'v1',
  );
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: HYDRATION_DAILY_PLAN_DOMAIN,
    service: HYDRATION_DAILY_PLAN_SERVICE,
    method,
    version,
  });
}
