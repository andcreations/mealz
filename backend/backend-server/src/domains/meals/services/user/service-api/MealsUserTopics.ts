import { buildTopic } from '@mealz/backend-transport';

export class MealsUserTopics {
  public static readonly CreateUserMealV1 = topic('createUserMeal', 'v1');
  public static readonly UpsertUserMealV1 = topic('upsertUserMeal', 'v1');
};

function topic(method: string, version: string): string {
  return buildTopic({
    domain: 'meals',
    service: 'user',
    method,
    version,
  });
}
