import { HttpStatus } from '@nestjs/common';
import { MealzError } from './MealzError';

export class UnauthorizedError extends MealzError {
  public static readonly CODE = UnauthorizedError.name;

  public constructor(msg?: string) {
    super(
      msg ?? 'Unauthorized',
      UnauthorizedError.CODE,
      HttpStatus.UNAUTHORIZED,
    );
  }
}