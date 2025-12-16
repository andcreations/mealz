import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class NamedMealNotFoundError extends MealzError {
  public static readonly CODE = NamedMealNotFoundError.name;

  public constructor(id: string) {
    super(
      `Named meal ${MealzError.quote(id)} not found`,
      NamedMealNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
}