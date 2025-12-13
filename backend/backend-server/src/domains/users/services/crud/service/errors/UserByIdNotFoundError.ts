import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class UserByIdNotFoundError extends MealzError {
  public static readonly CODE = UserByIdNotFoundError.name;

  public constructor(id: string) {
    super(
      `User ${MealzError.quote(id)} not found`,
      UserByIdNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
}