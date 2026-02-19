import { Injectable } from '@nestjs/common';
import { GWTelegramUser } from '@mealz/backend-telegram-users-gateway-api';
import { TelegramUser } from '@mealz/backend-telegram-users-service-api';

@Injectable()
export class GWTelegramUserMapper {
  public fromTelegramUser(
    telegramUser?: TelegramUser,
  ): GWTelegramUser {
    if (!telegramUser) {
      return undefined;
    }
    return {
      telegramUsername: telegramUser.telegramUsername,
      isEnabled: telegramUser.isEnabled,
    };
  }
}