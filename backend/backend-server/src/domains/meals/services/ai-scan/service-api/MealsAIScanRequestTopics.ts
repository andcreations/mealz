import { buildRequestTopic } from '@mealz/backend-transport';
import {
  MEALS_AI_SCAN_DOMAIN,
  MEALS_AI_SCAN_SERVICE,
} from './domain-and-service';

export class MealsAIScanRequestTopics {
  public static readonly ScanPhotoV1 = topic('scanPhoto', 'v1');
};

function topic(method: string, version: string): string {
  return buildRequestTopic({
    domain: MEALS_AI_SCAN_DOMAIN,
    service: MEALS_AI_SCAN_SERVICE,
    method,
    version,
  });
}
