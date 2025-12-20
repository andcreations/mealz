import { buildRequestTopic } from '@mealz/backend-transport';
import {
  ADMIN_NOTIFICATIONS_DOMAIN,
  ADMIN_NOTIFICATIONS_SERVICE,
} from './domain-and-service';

export class AdminNotificationsRequestTopics {
  public static readonly SendAdminNotificationV1 = topic(
    'sendAdminNotification',
    'v1',
  );
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: ADMIN_NOTIFICATIONS_DOMAIN,
    service: ADMIN_NOTIFICATIONS_SERVICE,
    method,
    version,
  });
}
