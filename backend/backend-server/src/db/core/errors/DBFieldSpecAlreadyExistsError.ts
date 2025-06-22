import { HttpStatus } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

export class DBFieldSpecAlreadyExistsError extends MealzError {
  public static readonly CODE = 'DBFieldSpecAlreadyExistsError';

  public constructor(entityName: string, fieldName: string) {
    super(
      `DB field ${MealzError.quote(fieldName)} already exists ` +
      `in DB entity ${MealzError.quote(entityName)}`,
      DBFieldSpecAlreadyExistsError.CODE,
      HttpStatus.CONFLICT,
    );
  }
}