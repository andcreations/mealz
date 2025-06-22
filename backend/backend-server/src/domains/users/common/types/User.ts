import { UserRole } from '#mealz/backend-api';

export interface User {
  id: string;
  email: string;
  password?: string;
  roles?: UserRole[];
}