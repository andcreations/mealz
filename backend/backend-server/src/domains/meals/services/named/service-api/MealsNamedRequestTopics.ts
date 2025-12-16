import { buildRequestTopic } from '@mealz/backend-transport';
import { MEALS_NAMED_DOMAIN, MEALS_NAMED_SERVICE } from './domain-and-service';

export class MealsNamedRequestTopics {
  public static readonly ReadNamedMealsFromLastV1 = topic(
    'readNamedMealsFromLast',
    'v1',
  );
  public static readonly CreateNamedMealV1 = topic(
    'createNamedMeal',
    'v1',
  );
  public static readonly UpdateNamedMealV1 = topic(
    'updateNamedMeal',
    'v1',
  );
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: MEALS_NAMED_DOMAIN,
    service: MEALS_NAMED_SERVICE,
    method,
    version,
  });
}
