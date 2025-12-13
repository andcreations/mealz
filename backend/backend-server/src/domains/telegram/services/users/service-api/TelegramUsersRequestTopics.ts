import { buildRequestTopic } from '@mealz/backend-transport';
import {
  TELEGRAM_USERS_DOMAIN,
  TELEGRAM_USERS_SERVICE,
} from './domain-and-service';

export class TelegramUsersRequestTopics {
  public static readonly GenerateStartLinkV1 = topic('generateStartLink', 'v1');
  public static readonly VerifyStartTokenV1 = topic('verifyStartToken', 'v1');
  public static readonly UpsertTelegramUserV1 = topic(
    'upsertTelegramUser',
    'v1',
  );
  public static readonly ReadTelegramUserV1 = topic('readTelegramUser', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: TELEGRAM_USERS_DOMAIN,
    service: TELEGRAM_USERS_SERVICE,
    method,
    version,
  });
}
