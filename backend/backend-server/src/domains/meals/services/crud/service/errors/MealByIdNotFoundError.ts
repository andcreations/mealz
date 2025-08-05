import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class MealByIdNotFoundError extends MealzError {
  public static readonly CODE = MealByIdNotFoundError.name;

  public constructor(id: string) {
    super(
      `Meal ${MealzError.quote(id)} not found`,
      MealByIdNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }  
}