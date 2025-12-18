import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class EventControllerSpecAlreadyExistsError extends MealzError {
  public static readonly CODE = EventControllerSpecAlreadyExistsError.name;

  public constructor(controllerName: string) {
    super(
      `Event controller spec for ` +
      `${MealzError.quote(controllerName)} already exists`,
      EventControllerSpecAlreadyExistsError.CODE,
      HttpStatus.CONFLICT,
    );
  }
}
