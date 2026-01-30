import { HttpException, HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class MissingFileInRequestError extends MealzError {
  public static readonly CODE = MissingFileInRequestError.name;

  constructor(fieldName: string) {
    super(
      `File ${MealzError.quote(fieldName)} is required`,
      MissingFileInRequestError.CODE,
      HttpStatus.BAD_REQUEST,
    );
  }
}