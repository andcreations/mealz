import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class DBEntityConstraintError extends MealzError {
  public static readonly CODE = DBEntityConstraintError.name;

  public constructor(
    entityName: string,
    primaryKey?: string,
    details?: string,
  ) {
    super(
      DBEntityConstraintError.buildMessage(entityName, primaryKey, details),
      DBEntityConstraintError.CODE,
      HttpStatus.CONFLICT,
    );
  }

  private static buildMessage(
    entityName: string,
    primaryKey?: string,
    details?: string,
  ): string {
    let message =
      `Caught constraint error for ` +
      `DB entity ${MealzError.quote(entityName)}`;
    if (primaryKey) {
      message += ` with primary key ${MealzError.quote(primaryKey)}`;
    }
    if (details) {
      message += ` (${details})`;
    }
    return message;
  }
}