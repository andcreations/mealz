import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class DBEntityNotFoundError extends MealzError {
  public static readonly CODE = 'DBEntityNotFoundError';

  public constructor(id: string, entityName: string) {
    super(
      `DB entity ${MealzError.quote(id)} of ` +
      `type ${MealzError.quote(entityName)} not found`,
      DBEntityNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
}