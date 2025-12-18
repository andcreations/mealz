import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class RequestHandlerNotFoundError extends MealzError {
  public static readonly CODE = RequestHandlerNotFoundError.name;

  public constructor(topic: string) {
    super(
      `Request handler for ` +
      `${MealzError.quote(topic)} not found`,
      RequestHandlerNotFoundError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
