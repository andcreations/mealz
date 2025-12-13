import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class InvalidStartTokenError extends MealzError {
  public static readonly CODE = InvalidStartTokenError.name;

  public constructor() {
    super(
      'Invalid start token',
      InvalidStartTokenError.CODE,
      HttpStatus.BAD_REQUEST,
    );
  }
}