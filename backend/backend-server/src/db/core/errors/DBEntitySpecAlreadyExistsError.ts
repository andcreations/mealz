import { HttpStatus } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

export class DBEntitySpecAlreadyExistsError extends MealzError {
  public static readonly CODE = 'DBEntitySpecAlreadyExistsError';

  public constructor(entityName: string) {
    super(
      `DB entity spec for ${MealzError.quote(entityName)} already exists`,
      DBEntitySpecAlreadyExistsError.CODE,
      HttpStatus.CONFLICT,
    );
  }
}