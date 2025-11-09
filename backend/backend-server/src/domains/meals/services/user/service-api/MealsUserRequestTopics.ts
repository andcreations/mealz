import { buildRequestTopic } from '@mealz/backend-transport';
import { MEALS_USER_DOMAIN, MEALS_USER_SERVICE } from './domain-and-service';

export class MealsUserRequestTopics {
  public static readonly ReadManyV1 = topic('readMany', 'v1');
  public static readonly CreateUserMealV1 = topic('createUserMeal', 'v1');
  public static readonly UpsertUserMealV1 = topic('upsertUserMeal', 'v1');
  public static readonly DeleteUserMealV1 = topic('deleteUserMeal', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: MEALS_USER_DOMAIN,
    service: MEALS_USER_SERVICE,
    method,
    version,
  });
}
