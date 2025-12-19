import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class RequestControllerSpecAlreadyExistsError extends MealzError {
  public static readonly CODE = RequestControllerSpecAlreadyExistsError.name;

  public constructor(controllerName: string) {
    super(
      `Request controller spec for ` +
      `${MealzError.quote(controllerName)} already exists`,
      RequestControllerSpecAlreadyExistsError.CODE,
      HttpStatus.CONFLICT,
    );
  }
}
