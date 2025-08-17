import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class UserMealByIdNotFoundError extends MealzError {
  public static readonly CODE = UserMealByIdNotFoundError.name;

  public constructor(id: string) {
    super(
      `User meal ${MealzError.quote(id)} not found`,
      UserMealByIdNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }  
}