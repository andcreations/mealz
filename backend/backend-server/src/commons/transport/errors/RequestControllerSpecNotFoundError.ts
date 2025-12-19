import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class RequestControllerSpecNotFoundError extends MealzError {
  public static readonly CODE = RequestControllerSpecNotFoundError.name;

  public constructor(controllerName: string) {
    super(
      `Request controller spec for ` +
      `${MealzError.quote(controllerName)} not found`,
      RequestControllerSpecNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
} 