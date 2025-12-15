import { buildRequestTopic } from '@mealz/backend-transport';
import {
  TELEGRAM_BOT_DOMAIN,
  TELEGRAM_BOT_SERVICE,
} from './domain-and-service';

export class TelegramBotRequestTopics {
  public static readonly LogWebhookTokenV1 = topic('logWebhookToken', 'v1');
  public static readonly HandleUpdateV1 = topic('handleUpdate', 'v1');
  public static readonly SendMessageToUserV1 = topic('sendMessageToUser', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: TELEGRAM_BOT_DOMAIN,
    service: TELEGRAM_BOT_SERVICE,
    method,
    version,
  });
}
