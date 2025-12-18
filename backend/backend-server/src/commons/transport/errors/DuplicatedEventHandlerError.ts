import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class DuplicatedEventHandlerError extends MealzError {
  public static readonly CODE = DuplicatedEventHandlerError.name;

  public constructor(topic: string) {
    super(
      `Duplicated event handler for ` +
      `topic ${MealzError.quote(topic)}`,
      DuplicatedEventHandlerError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
