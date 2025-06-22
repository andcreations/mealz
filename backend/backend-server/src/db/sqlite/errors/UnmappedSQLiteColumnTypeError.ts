import { HttpStatus } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

export class UnmappedSQLiteColumnTypeError extends MealzError {
  public static readonly CODE = UnmappedSQLiteColumnTypeError.name;

  constructor(columnName: string, columnType: string) {
    super(
      `Unmapped SQLite type ${columnType} of column ${columnName}`,
      UnmappedSQLiteColumnTypeError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}