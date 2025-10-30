import { buildRequestTopic } from '@mealz/backend-transport';
import { USERS_AUTH_DOMAIN, USERS_AUTH_SERVICE } from './domain-and-service';

export class UsersAuthRequestTopics {
  public static readonly AuthUserV1 = topic('authUser', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: USERS_AUTH_DOMAIN,
    service: USERS_AUTH_SERVICE,
    method,
    version,
  });
}
