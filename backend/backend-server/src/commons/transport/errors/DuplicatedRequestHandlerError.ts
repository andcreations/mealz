import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class DuplicatedRequestHandlerError extends MealzError {
  public static readonly CODE = DuplicatedRequestHandlerError.name;

  public constructor(topic: string) {
    super(
      `Duplicated request handler for ` +
      `topic ${MealzError.quote(topic)}`,
      DuplicatedRequestHandlerError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
