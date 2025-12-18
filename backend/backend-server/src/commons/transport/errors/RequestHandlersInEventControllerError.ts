import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class RequestHandlersInEventControllerError extends MealzError {
  public static readonly CODE = RequestHandlersInEventControllerError.name;

  public constructor(topics: string[]) {
    super(
      `Request handlers for topics ${MealzError.quote(topics)} ` +
      `in event controller`,
      RequestHandlersInEventControllerError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
