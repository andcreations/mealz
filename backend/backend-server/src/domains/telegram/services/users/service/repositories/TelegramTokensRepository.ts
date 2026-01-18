import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { DBRepository, InjectDBRepository } from '@mealz/backend-db';
import { TelegramToken } from '@mealz/backend-telegram-users-common';

import { 
  TELEGRAM_USERS_DB_NAME,
  TELEGRAM_TOKEN_DB_ENTITY_NAME,
  TelegramTokenDBEntity,
  TelegramTokenDBMapper,
} from '../db';

@Injectable()
export class TelegramTokensRepository {
  public constructor(
    @InjectDBRepository(TELEGRAM_USERS_DB_NAME, TELEGRAM_TOKEN_DB_ENTITY_NAME)
    private readonly repository: DBRepository<TelegramTokenDBEntity>,
    private readonly mapper: TelegramTokenDBMapper,
  ) {}

  public async upsertToken(
    token: TelegramToken,
    context: Context,
  ): Promise<void> {
    const entity = this.mapper.toEntity(token);
    await this.repository.upsert(
      this.opName('upsertToken'),
      entity,
      context,
    );
  }

  public async readToken(
    token: string,
    context: Context,
  ): Promise<TelegramToken | undefined> {
    const entity = await this.repository.findOne(
      this.opName('readToken'),
      { token: { $eq: token }},
      {},
      context,
    );
    return this.mapper.fromEntity(entity);
  }

  private opName(name: string): string {
    return `${TelegramTokensRepository.name}.${name}`;
  }
}