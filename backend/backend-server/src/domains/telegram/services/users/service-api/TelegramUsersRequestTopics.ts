import { buildRequestTopic } from '@mealz/backend-transport';
import {
  TELEGRAM_USERS_DOMAIN,
  TELEGRAM_USERS_SERVICE,
} from './domain-and-service';

export class TelegramUsersRequestTopics {
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: TELEGRAM_USERS_DOMAIN,
    service: TELEGRAM_USERS_SERVICE,
    method,
    version,
  });
}
