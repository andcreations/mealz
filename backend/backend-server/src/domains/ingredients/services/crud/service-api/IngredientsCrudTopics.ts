import { buildTopic } from '@mealz/backend-transport';

export class IngredientsCrudTopics {
  public static readonly ReadFromLastV1 = topic('readFromLast', 'v1');
};

function topic(method: string, version: string): string {
  return buildTopic({
    domain: 'ingredients',
    service: 'crud',
    method,
    version,
  });
}
