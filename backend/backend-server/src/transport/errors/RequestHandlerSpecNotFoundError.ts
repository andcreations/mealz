import { HttpStatus } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

export class RequestHandlerSpecNotFoundError extends MealzError {
  public static readonly CODE = RequestHandlerSpecNotFoundError.name;

  public constructor(topic: string) {
    super(
      `Request handler spec for ` +
      `${MealzError.quote(topic)} not found`,
      RequestHandlerSpecNotFoundError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
