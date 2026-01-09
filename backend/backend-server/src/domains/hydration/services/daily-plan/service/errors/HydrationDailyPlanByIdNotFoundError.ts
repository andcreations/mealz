import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class HydrationDailyPlanByIdNotFoundError extends MealzError {
  public static readonly CODE = HydrationDailyPlanByIdNotFoundError.name;

  public constructor(id: string) {
    super(
      `Hydration daily plan ${MealzError.quote(id)} not found`,
      HydrationDailyPlanByIdNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
}