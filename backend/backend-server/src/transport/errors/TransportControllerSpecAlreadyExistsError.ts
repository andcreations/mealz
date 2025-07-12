import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class TransportControllerSpecAlreadyExistsError extends MealzError {
  public static readonly CODE = TransportControllerSpecAlreadyExistsError.name;

  public constructor(controllerName: string) {
    super(
      `Transport controller spec for ` +
      `${MealzError.quote(controllerName)} already exists`,
      TransportControllerSpecAlreadyExistsError.CODE,
      HttpStatus.CONFLICT,
    );
  }
}
