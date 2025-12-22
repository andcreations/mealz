import { buildRequestTopic } from '@mealz/backend-transport';
import {
  USERS_NOTIFICATIONS_DOMAIN,
  USERS_NOTIFICATIONS_SERVICE,
} from './domain-and-service';

export class UsersNotificationsRequestTopics {
  public static readonly SendBasicUserNotificationV1 = topic(
    'sendBasicUserNotification',
    'v1',
  );
  public static readonly ReadUserNotificationsInfoV1 = topic(
    'readUserNotificationsInfo',
    'v1',
  );
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: USERS_NOTIFICATIONS_DOMAIN,
    service: USERS_NOTIFICATIONS_SERVICE,
    method,
    version,
  });
}
