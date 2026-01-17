import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { DBRepository, InjectDBRepository } from '@mealz/backend-db';
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

  private opName(name: string): string {
    return `${TelegramUsersRepository.name}.${name}`;
  }
}