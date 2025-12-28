import { User } from '@mealz/backend-users-common';

export const USER_FIELDS_WITHOUT_PASSWORD: (keyof User)[] = [
  'id', 
  'firstName',
  'lastName',
  'email',
  'roles',
];