import { buildRequestTopic } from '@mealz/backend-transport';
import { MEALS_CRUD_DOMAIN, MEALS_CRUD_SERVICE } from './domain-and-service';

export class MealsCrudRequestTopics {
  public static readonly ReadMealByIdV1 = topic('readMealById', 'v1');
  public static readonly ReadMealsByIdV1 = topic('readMealsById', 'v1');
  public static readonly CreateMealV1 = topic('createMeal', 'v1');
  public static readonly UpsertMealV1 = topic('upsertMeal', 'v1');
  public static readonly DeleteMealByIdV1 = topic('deleteMealById', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: MEALS_CRUD_DOMAIN,
    service: MEALS_CRUD_SERVICE,
    method,
    version,
  });
}
