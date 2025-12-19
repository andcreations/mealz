import { buildLocalEventTopic } from '@mealz/backend-transport';
import { MODULE_NAME } from './module';

export class SQLiteDBLocalEventTopics {
  public static readonly DatabasesBackedUpV1 = topic(
    'databasesBackedUp',
    'v1',
  );
}

function topic(method: string, version: string): string {
  return buildLocalEventTopic({
    module: MODULE_NAME,
    method,
    version,
  });
}