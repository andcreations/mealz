import { HttpStatus } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

export class SQLiteInvalidValueError extends MealzError {
  public static readonly CODE = SQLiteInvalidValueError.name;

  constructor(entityName: string, message: string) {
    super(
      `[entity:${entityName}] ${message}`,
      SQLiteInvalidValueError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }  
}