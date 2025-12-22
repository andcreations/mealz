import { buildRequestTopic } from '@mealz/backend-transport';
import { USERS_CRUD_DOMAIN, USERS_CRUD_SERVICE } from './domain-and-service';

export class UsersCrudRequestTopics {
  public static readonly ReadUserByIdV1 = topic('readUserById', 'v1');
  public static readonly ReadUsersFromLastV1 = topic('readUsersFromLast', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: USERS_CRUD_DOMAIN,
    service: USERS_CRUD_SERVICE,
    method,
    version,
  });
}
