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
      chat_id: telegramUser.chatId,
      is_enabled: telegramUser.isEnabled,
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
      chatId: entity.chat_id,
      isEnabled: entity.is_enabled,
    };
  }
}
