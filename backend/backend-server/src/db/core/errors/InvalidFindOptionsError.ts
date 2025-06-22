import { HttpStatus } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

export class InvalidFindOptionsError extends MealzError {
  public static readonly CODE = InvalidFindOptionsError.name;

  public constructor(entityName: string, message: string) {
    super(
      `[entity ${MealzError.quote(entityName)}] ${message}`,
      InvalidFindOptionsError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}