import { HttpStatus } from '@nestjs/common';
import { errorToString, MealzError } from '#mealz/backend-common';

export class UnknownDBError extends MealzError {
  public static readonly CODE = UnknownDBError.name;

  public constructor(error: any) {
    super(
      errorToString(error),
      UnknownDBError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}