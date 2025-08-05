import { buildTopic } from '@mealz/backend-transport';

export class MealsCrudTopics {
  public static readonly ReadMealByIdV1 = topic('readMealById', 'v1');
  public static readonly CreateMealV1 = topic('createMeal', 'v1');
  public static readonly UpsertMealV1 = topic('upsertMeal', 'v1');
  public static readonly DeleteMealByIdV1 = topic('deleteMealById', 'v1');
};

function topic(method: string, version: string): string {
  return buildTopic({
    domain: 'meals',
    service: 'crud',
    method,
    version,
  });
}
