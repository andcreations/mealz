import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class InvalidPasswordError extends MealzError {
  public static readonly CODE = InvalidPasswordError.name;

  public constructor() {
    super(
      `Invalid password`,
      InvalidPasswordError.CODE,
      HttpStatus.UNAUTHORIZED,
    );
  }
}