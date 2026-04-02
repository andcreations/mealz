import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class ActionNotFoundError extends MealzError {
  public static readonly CODE = ActionNotFoundError.name;

  public constructor(actionId: string) {
    super(
      `Action ${MealzError.quote(actionId)} not found`,
      ActionNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
}