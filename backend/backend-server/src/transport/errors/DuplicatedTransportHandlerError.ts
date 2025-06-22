import { HttpStatus } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

export class DuplicatedTransportHandlerError extends MealzError {
  public static readonly CODE = DuplicatedTransportHandlerError.name;

  public constructor(topic: string) {
    super(
      `Duplicated transport handler for ` +
      `topic ${MealzError.quote(topic)}`,
      DuplicatedTransportHandlerError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
