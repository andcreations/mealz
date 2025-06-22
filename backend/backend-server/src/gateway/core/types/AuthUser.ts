import { UserRole } from '#mealz/backend-api';

export interface AuthUser {
  id: string;
  roles: UserRole[];
}