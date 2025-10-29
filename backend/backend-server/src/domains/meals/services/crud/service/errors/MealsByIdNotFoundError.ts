import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class MealsByIdNotFoundError extends MealzError {
  public static readonly CODE = MealsByIdNotFoundError.name;

  public constructor(ids: string[]) {
    super(
      `Meal ${MealzError.quote(ids)} not found`,
      MealsByIdNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
}