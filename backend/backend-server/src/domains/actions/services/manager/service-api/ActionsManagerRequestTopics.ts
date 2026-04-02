import { buildRequestTopic } from '@mealz/backend-transport';
import {
  ACTIONS_MANAGER_DOMAIN,
  ACTIONS_MANAGER_SERVICE,
} from './domain-and-service';

export class ActionsManagerRequestTopics {
  public static readonly CreateActionV1 = topic('createAction', 'v1');
  public static readonly RunActionV1 = topic('runAction', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: ACTIONS_MANAGER_DOMAIN,
    service: ACTIONS_MANAGER_SERVICE,
    method,
    version,
  });
}
