import { buildRequestTopic } from '@mealz/backend-transport';
import { MEALS_LOG_DOMAIN, MEALS_LOG_SERVICE } from './domain-and-service';

export class MealsLogRequestTopics {
  public static readonly LogMealV1 = topic('logMeal', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: MEALS_LOG_DOMAIN,
    service: MEALS_LOG_SERVICE,
    method,
    version,
  });
}
