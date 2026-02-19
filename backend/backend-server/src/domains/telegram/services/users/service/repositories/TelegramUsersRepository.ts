import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  DBRepository,
  InjectDBRepository,
  Update,
} from '@mealz/backend-db';
import { TelegramUser } from '@mealz/backend-telegram-users-service-api';

import { 
  TELEGRAM_USERS_DB_NAME,
  TELEGRAM_USER_DB_ENTITY_NAME,
  TelegramUserDBEntity,
  TelegramUserDBMapper,
} from '../db';

@Injectable()
export class TelegramUsersRepository {
  public constructor(
    @InjectDBRepository(TELEGRAM_USERS_DB_NAME, TELEGRAM_USER_DB_ENTITY_NAME)
    private readonly repository: DBRepository<TelegramUserDBEntity>,
    private readonly mapper: TelegramUserDBMapper,
  ) {}

  public async upsertTelegramUser(
    user: TelegramUser,
    context: Context,
  ): Promise<void> {
    const entity = this.mapper.toEntity(user);
    await this.repository.upsert(
      this.opName('upsertTelegramUser'),
      entity,
      context,
    );
  }

  public async readTelegramUser(
    userId: string,
    context: Context,
  ): Promise<TelegramUser> {
    const entity = await this.repository.findOne(
      this.opName('readTelegramUser'),
      { user_id: { $eq: userId } },
      {},
      context,
    );
    return this.mapper.fromEntity(entity);
  }

  public async readTelegramUserByChatId(
    telegramChatId: number,
    context: Context,
  ): Promise<TelegramUser> {
    const entity = await this.repository.findOne(
      this.opName('readTelegramUserByChatId'),
      { telegram_chat_id: { $eq: telegramChatId } },
      {},
      context,
    );
    return this.mapper.fromEntity(entity);
  }

  public async patchTelegramUser(
    userId: string,
    isEnabled: boolean | undefined,
    context: Context,
  ): Promise<void> {
    const update: Update<TelegramUserDBEntity> = {};
    if (isEnabled !== undefined) {
      update.is_enabled = { $set: isEnabled ? 1 : 0 };
    }

    // if there is no update
    if (Object.keys(update).length === 0) {
      return;
    }

    // update
    await this.repository.update(
      this.opName('patchTelegramUser'),
      { user_id: { $eq: userId } },
      update,
      context,
    );
  }

  private opName(name: string): string {
    return `${TelegramUsersRepository.name}.${name}`;
  }
}