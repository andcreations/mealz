import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class EventHandlersInRequestControllerError extends MealzError {
  public static readonly CODE = EventHandlersInRequestControllerError.name;

  public constructor(topics: string[]) {
    super(
      `Event handlers for topics ${MealzError.quote(topics)} ` +
      `in request controller`,
      EventHandlersInRequestControllerError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
