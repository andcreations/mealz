import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class SQLiteWhereBuildError extends MealzError {
  public static readonly CODE = SQLiteWhereBuildError.name;

  constructor(entityName: string, message: string) {
    super(
      `[entity:${entityName}] ${message}`,
      SQLiteWhereBuildError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }  
}