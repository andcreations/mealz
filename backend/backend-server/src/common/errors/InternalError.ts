import { HttpStatus } from '@nestjs/common';
import { MealzError } from './MealzError';

export class InternalError extends MealzError {
  public static readonly CODE = InternalError.name;

  public constructor(msg: string) {
    super(msg, InternalError.CODE, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}