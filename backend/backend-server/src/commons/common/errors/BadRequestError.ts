import { HttpStatus } from '@nestjs/common';
import { MealzError } from './MealzError';

export class BadRequestError extends MealzError {
  public static readonly CODE = BadRequestError.name;

  public constructor(msg: string) {
    super(msg, BadRequestError.CODE, HttpStatus.BAD_REQUEST);
  }
}