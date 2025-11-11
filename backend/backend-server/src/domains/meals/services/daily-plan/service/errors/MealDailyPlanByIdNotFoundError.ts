import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class MealDailyPlanByIdNotFoundError extends MealzError {
  public static readonly CODE = MealDailyPlanByIdNotFoundError.name;

  public constructor(id: string) {
    super(
      `Meal daily plan ${MealzError.quote(id)} not found`,
      MealDailyPlanByIdNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
}