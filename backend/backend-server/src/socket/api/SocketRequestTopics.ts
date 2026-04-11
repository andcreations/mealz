import { buildRequestTopic } from '@mealz/backend-transport';
import { SOCKET_DOMAIN, SOCKET_SERVICE } from './domain-and-service';

export class SocketRequestTopics {
  public static readonly SendMessageToUserV1 = topic('sendMessageToUser', 'v1');
}

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: SOCKET_DOMAIN,
    service: SOCKET_SERVICE,
    method,
    version,
  });
}