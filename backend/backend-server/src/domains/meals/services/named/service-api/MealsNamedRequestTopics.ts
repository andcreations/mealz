import { buildRequestTopic } from '@mealz/backend-transport';
import { MEALS_NAMED_DOMAIN, MEALS_NAMED_SERVICE } from './domain-and-service';

export class MealsNamedRequestTopics {
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: MEALS_NAMED_DOMAIN,
    service: MEALS_NAMED_SERVICE,
    method,
    version,
  });
}
