import { Injectable } from '@nestjs/common';
import { TelegramMessage } from '@andcreations/telegram-bot';
import {
  OutgoingTelegramMessage,
  OutgoingTelegramMessageStatus,
} from '@mealz/backend-telegram-bot-service-api';

import { OutgoingTelegramMessageDBEntity } from '../entities';

@Injectable()
export class OutgoingTelegramMessageDBMapper {
  public toEntity(
    outgoingMessage: OutgoingTelegramMessage,
  ): OutgoingTelegramMessageDBEntity {
    return {
      id: outgoingMessage.id,
      user_id: outgoingMessage.userId,
      type_id: outgoingMessage.typeId,
      telegram_chat_id: outgoingMessage.telegramChatId,
      telegram_message_id: outgoingMessage.telegramMessageId,
      content: JSON.stringify(outgoingMessage.content),
      status: outgoingMessage.status,
      sent_at: outgoingMessage.sentAt,
    };
  }

  public fromEntity(
    entity: OutgoingTelegramMessageDBEntity | undefined,
  ): OutgoingTelegramMessage | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      id: entity.id,
      userId: entity.user_id,
      typeId: entity.type_id,
      telegramChatId: entity.telegram_chat_id,
      telegramMessageId: entity.telegram_message_id,
      content: JSON.parse(entity.content) as TelegramMessage,
      status: entity.status as OutgoingTelegramMessageStatus,
      sentAt: entity.sent_at,
    };
  }

  public fromEntities(
    entities: OutgoingTelegramMessageDBEntity[],
  ): OutgoingTelegramMessage[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}
