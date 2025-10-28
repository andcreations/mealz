import { buildTopic } from '@mealz/backend-transport';

export class UsersAuthTopics {
  public static readonly AuthUserV1 = topic('authUser', 'v1');
  public static readonly CheckUserAuthV1 = topic('checkUserAuth', 'v1');
};

function topic(method: string, version: string): string {
  return buildTopic({
    domain: 'users',
    service: 'auth',
    method,
    version,
  });
}
