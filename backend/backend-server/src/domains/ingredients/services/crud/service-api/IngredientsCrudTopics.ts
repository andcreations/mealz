import { buildTopic } from '#mealz/backend-transport';

export const IngredientsCrudTopics: Record<string, string> = {
  ReadFromLastV1: topic('readFromLast', 'v1'),
};

function topic(method: string, version: string): string {
  return buildTopic({
    domain: 'ingredients',
    service: 'crud',
    method,
    version,
  });
}
