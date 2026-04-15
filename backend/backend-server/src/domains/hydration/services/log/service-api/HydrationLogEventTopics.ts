import { buildEventTopic } from '@mealz/backend-transport';
import {
  HYDRATION_LOG_DOMAIN,
  HYDRATION_LOG_SERVICE,
} from './domain-and-service';

export class HydrationLogEventTopics {
  public static readonly HydrationLoggedExternallyV1 = topic(
    'hydrationLoggedExternally',
    'v1',
  );
};

function topic(method: string, version: string): string {
  return buildEventTopic({
    domain: HYDRATION_LOG_DOMAIN,
    service: HYDRATION_LOG_SERVICE,
    method,
    version,
  });
}
