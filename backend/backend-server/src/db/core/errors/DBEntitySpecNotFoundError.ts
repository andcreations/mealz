import { HttpStatus } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

export class DBEntitySpecNotFoundError extends MealzError {
  public static readonly CODE = 'DBEntitySpecNotFoundError';

  public constructor(entityName: string) {
    super(
      `DB entity spec for ${MealzError.quote(entityName)} not found`,
      DBEntitySpecNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
}