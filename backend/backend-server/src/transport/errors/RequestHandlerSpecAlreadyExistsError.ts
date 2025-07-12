import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class RequestHandlerSpecAlreadyExistsError extends MealzError {
  public static readonly CODE = RequestHandlerSpecAlreadyExistsError.name;

  public constructor(topic: string) {
    super(
      `Request handle spec for ` +
      `${MealzError.quote(topic)} already exists`,
      RequestHandlerSpecAlreadyExistsError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
