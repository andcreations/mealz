import { Injectable } from '@nestjs/common';
import { TelegramUser } from '@mealz/backend-telegram-users-service-api';

import { TelegramUserDBEntity } from '../entities';

@Injectable()
export class TelegramUserDBMapper {
  public toEntity(
    telegramUser: TelegramUser,
  ): TelegramUserDBEntity {
    return {
      id: telegramUser.id,
      user_id: telegramUser.userId,
      telegram_chat_id: telegramUser.telegramChatId,
      telegram_user_id: telegramUser.telegramUserId,
      telegram_username: telegramUser.telegramUsername,
      is_enabled: telegramUser.isEnabled ? 1 : 0,
    };
  }

  public fromEntity(
    entity: TelegramUserDBEntity | undefined,
  ): TelegramUser | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      id: entity.id,
      userId: entity.user_id,
      telegramChatId: entity.telegram_chat_id,
      telegramUserId: entity.telegram_user_id,
      telegramUsername: entity.telegram_username,
      isEnabled: entity.is_enabled === 1,
    };
  }
}
