import { MealzError } from '#mealz/backend-common';
import { HttpStatus } from '@nestjs/common';

export class DBEntityAlreadyExistsError extends MealzError {
  public static readonly CODE = 'DBEntityAlreadyExistsError';

  public constructor(entityName: string) {
    super(
      `DB entity ${MealzError.quote(entityName)} already exists`,
      DBEntityAlreadyExistsError.CODE,
      HttpStatus.CONFLICT,
    );
  }
}