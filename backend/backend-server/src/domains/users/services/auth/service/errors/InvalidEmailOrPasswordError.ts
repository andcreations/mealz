import { HttpStatus } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

export class InvalidEmailOrPasswordError extends MealzError {
  public static readonly CODE = InvalidEmailOrPasswordError.name;

  public constructor() {
    super(
      `Invalid email or password`,
      InvalidEmailOrPasswordError.CODE,
      HttpStatus.UNAUTHORIZED,
    );
  }
}