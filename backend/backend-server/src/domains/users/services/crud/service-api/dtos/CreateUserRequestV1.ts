import { User } from '@mealz/backend-users-common';

export interface CreateUserRequestV1 {
  user: Omit<User, 'id'>;
}