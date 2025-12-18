import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class MissingRequiredDBFieldError extends MealzError {
  public static readonly CODE = MissingRequiredDBFieldError.name;

  public constructor(entityName: string, fieldName: string) {
    super(
      `Missing required DBfield ${MealzError.quote(fieldName)} ` +
      `in entity ${MealzError.quote(entityName)}`,
      MissingRequiredDBFieldError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
}