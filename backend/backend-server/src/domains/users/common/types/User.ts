import { UserRole } from '@mealz/backend-api';

export class User {
  public id: string;
  public firstName: string;
  public lastLame: string;
  public email: string;
  public password?: string;
  public roles?: UserRole[];
}