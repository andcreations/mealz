import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class EventControllerSpecNotFoundError extends MealzError {
  public static readonly CODE = EventControllerSpecNotFoundError.name;

  public constructor(controllerName: string) {
    super(
      `Event controller spec for ` +
      `${MealzError.quote(controllerName)} not found`,
      EventControllerSpecNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
} 