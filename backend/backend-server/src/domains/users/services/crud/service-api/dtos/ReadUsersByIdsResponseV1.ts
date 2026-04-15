import { UserWithoutPassword } from '@mealz/backend-users-common';

export interface ReadUsersByIdsResponseV1 {
  users: UserWithoutPassword[];
}
