import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class NamedMealAlreadyExistsError extends MealzError {
  public static readonly CODE = NamedMealAlreadyExistsError.name;

  public constructor(mealName: string) {
    super(
      `Named meal ${MealzError.quote(mealName)} already exists`,
      NamedMealAlreadyExistsError.CODE,
      HttpStatus.CONFLICT,
    );
  }
}