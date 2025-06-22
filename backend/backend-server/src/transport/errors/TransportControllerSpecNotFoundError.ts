import { HttpStatus } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

export class TransportControllerSpecNotFoundError extends MealzError {
  public static readonly CODE = TransportControllerSpecNotFoundError.name;

  public constructor(controllerName: string) {
    super(
      `Transport controller spec for ` +
      `${MealzError.quote(controllerName)} not found`,
      TransportControllerSpecNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
} 