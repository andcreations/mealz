import { buildRequestTopic } from '@mealz/backend-transport';
import {
  USERS_PROPERTIES_DOMAIN,
  USERS_PROPERTIES_SERVICE,
} from './domain-and-service';

export class UsersPropertiesRequestTopics {
  public static readonly ReadByUserIdAndPropertyIdV1 = topic(
    'readByUserIdAndPropertyId',
    'v1',
  );
  public static readonly UpsertUserPropertiesV1 = topic(
    'upsertUserProperties',
    'v1',
  );
}

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: USERS_PROPERTIES_DOMAIN,
    service: USERS_PROPERTIES_SERVICE,
    method,
    version,
  });
}
