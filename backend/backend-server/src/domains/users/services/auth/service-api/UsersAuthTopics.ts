import { buildTopic } from '@mealz/backend-transport';

export const UsersAuthTopics: Record<string, string> = {
  AuthUserV1: topic('authUser', 'v1'),
};

function topic(method: string, version: string): string {
  return buildTopic({
    domain: 'users',
    service: 'auth',
    method,
    version,
  });
}
