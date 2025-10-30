import { buildRequestTopic } from '@mealz/backend-transport';
import {
  INGREDIENTS_CRUD_DOMAIN,
  INGREDIENTS_CRUD_SERVICE,
} from './domain-and-service';

export class IngredientsCrudRequestTopics {
  public static readonly ReadFromLastV1 = topic('readFromLast', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: INGREDIENTS_CRUD_DOMAIN,
    service: INGREDIENTS_CRUD_SERVICE,
    method,
    version,
  });
}
