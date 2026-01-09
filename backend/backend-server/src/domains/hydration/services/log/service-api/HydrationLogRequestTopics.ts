import { buildRequestTopic } from '@mealz/backend-transport';
import {
  HYDRATION_LOG_DOMAIN,
  HYDRATION_LOG_SERVICE,
} from './domain-and-service';

export class HydrationLogRequestTopics {
  public static readonly ReadHydrationLogsByDateRangeV1 = topic(
    'readHydrationLogsByDateRange',
    'v1',
  );
  public static readonly LogHydrationV1 = topic('logHydration', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: HYDRATION_LOG_DOMAIN,
    service: HYDRATION_LOG_SERVICE,
    method,
    version,
  });
}
