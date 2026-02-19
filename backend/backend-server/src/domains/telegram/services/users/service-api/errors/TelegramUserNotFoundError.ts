import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export class TelegramUserNotFoundError extends MealzError {
  public static readonly CODE = TelegramUserNotFoundError.name;

  public constructor() {
    super(
      'Telegram user not found',
      TelegramUserNotFoundError.CODE,
      HttpStatus.NOT_FOUND,
    );
  }
}