import { UserRole } from '@mealz/backend-api';

export interface ContextUser {
  id: string;
  roles: UserRole[];
}