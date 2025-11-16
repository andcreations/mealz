import { MealzError } from '@mealz/backend-common';
import { HttpStatus } from '@nestjs/common';

export class DBEntityAlreadyExistsError extends MealzError {
  public static readonly CODE = 'DBEntityAlreadyExistsError';

  public constructor(
    entityName: string,
    primaryKey: string,
    details?: string,
  ) {
    super(
      `DB entity ${MealzError.quote(entityName)} with primary key ` +
      `${MealzError.quote(primaryKey)} already exists` +
      `${details ? ` (${details})` : ''}`,
      DBEntityAlreadyExistsError.CODE,
      HttpStatus.CONFLICT,
    );
  }
}