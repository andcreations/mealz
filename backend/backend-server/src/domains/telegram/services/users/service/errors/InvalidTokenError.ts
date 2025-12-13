import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class InvalidTokenError extends MealzError {
  public static readonly CODE = InvalidTokenError.name;

  public constructor() {
    super(
      'Invalid Telegram token',
      InvalidTokenError.CODE,
      HttpStatus.BAD_REQUEST,
    );
  }
}