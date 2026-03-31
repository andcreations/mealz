import { buildRequestTopic } from '@mealz/backend-transport';
import {
  ACTIONS_MANAGER_DOMAIN,
  ACTIONS_MANAGER_SERVICE,
} from './domain-and-service';

export class ActionsManagerRequestTopics {
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: ACTIONS_MANAGER_DOMAIN,
    service: ACTIONS_MANAGER_SERVICE,
    method,
    version,
  });
}
