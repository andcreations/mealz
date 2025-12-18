import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class EventHandlerNotFoundError extends MealzError {
  public static readonly CODE = EventHandlerNotFoundError.name;

  public constructor(topic: string) {
    super(
      `Event handler for ` +
      `${MealzError.quote(topic)} not found`,
      EventHandlerNotFoundError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
