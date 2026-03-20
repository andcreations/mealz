import { buildRequestTopic } from '@mealz/backend-transport';
import {
  EVENT_LOG_LOG_DOMAIN,
  EVENT_LOG_LOG_SERVICE,
} from './domain-and-service';

export class EventLogRequestTopics {
  public static readonly LogEventsV1 = topic('logEvents', 'v1');
}

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: EVENT_LOG_LOG_DOMAIN,
    service: EVENT_LOG_LOG_SERVICE,
    method,
    version,
  });
}
