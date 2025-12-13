import { Injectable } from '@nestjs/common';
import {
  TelegramToken,
  TelegramTokenType,
} from '@mealz/backend-telegram-users-common';

import { TelegramTokenDBEntity } from '../entities';

@Injectable()
export class TelegramTokenDBMapper {
  public toEntity(
    telegramToken: TelegramToken,
  ): TelegramTokenDBEntity {
    return {
      user_id: telegramToken.userId,
      type: telegramToken.type,
      token: telegramToken.token,
      expires_at: telegramToken.expiresAt,
    };
  }
  public fromEntity(
    entity: TelegramTokenDBEntity | undefined,
  ): TelegramToken | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      userId: entity.user_id,
      type: entity.type as unknown as TelegramTokenType,
      token: entity.token,
      expiresAt: entity.expires_at,
    };
  }
}