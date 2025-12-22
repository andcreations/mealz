import { UserWithoutPassword } from '@mealz/backend-users-common';

export interface ReadUsersFromLastResponseV1 {
  users: UserWithoutPassword[];
}