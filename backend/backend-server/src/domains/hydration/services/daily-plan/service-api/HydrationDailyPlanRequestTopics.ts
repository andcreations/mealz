import { buildRequestTopic } from '@mealz/backend-transport';
import {
  HYDRATION_DAILY_PLAN_DOMAIN,
  HYDRATION_DAILY_PLAN_SERVICE,
} from './domain-and-service';

export class HydrationDailyPlanRequestTopics {
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: HYDRATION_DAILY_PLAN_DOMAIN,
    service: HYDRATION_DAILY_PLAN_SERVICE,
    method,
    version,
  });
}
