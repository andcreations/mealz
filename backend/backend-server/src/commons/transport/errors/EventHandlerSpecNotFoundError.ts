import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class EventHandlerSpecNotFoundError extends MealzError {
  public static readonly CODE = EventHandlerSpecNotFoundError.name;

  public constructor(topic: string) {
    super(
      `Event handler spec for ` +
      `${MealzError.quote(topic)} not found`,
      EventHandlerSpecNotFoundError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
