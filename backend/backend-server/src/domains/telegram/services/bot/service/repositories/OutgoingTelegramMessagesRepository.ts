import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  DBRepository,
  InjectDBRepository,
  Where,
} from '@mealz/backend-db';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import {
  OutgoingTelegramMessage,
  OutgoingTelegramMessageStatus,
} from '@mealz/backend-telegram-bot-service-api';

import { OutgoingTelegramMessageForCreation } from '../types';
import {
  TELEGRAM_BOT_DB_NAME,
  OUTGOING_TELEGRAM_MESSAGE_DB_ENTITY_NAME,
  OutgoingTelegramMessageDBEntity,
  OutgoingTelegramMessageDBMapper,
} from '../db';

@Injectable()
export class OutgoingTelegramMessagesRepository {
  public constructor(
    @InjectDBRepository(
      TELEGRAM_BOT_DB_NAME,
      OUTGOING_TELEGRAM_MESSAGE_DB_ENTITY_NAME,
    )
    private readonly repository: DBRepository<OutgoingTelegramMessageDBEntity>,
    private readonly mapper: OutgoingTelegramMessageDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async create(
    outgoingMessage: OutgoingTelegramMessageForCreation,
    context: Context,
  ): Promise<void> {
    const entity = this.mapper.toEntity({
      ...outgoingMessage,
      id: this.idGenerator(),
      sentAt: Date.now(),
    });
    await this.repository.insert(
      this.opName('create'),
      entity,
      context,
    );
  }

  public async readByUserIdAndTypeIdFromLast(
    userId: string,
    typeId: string,
    lastId: string | undefined,
    limit: number,
    context: Context,
  ): Promise<OutgoingTelegramMessage[]> {
    const query: Where<OutgoingTelegramMessageDBEntity> = {
      user_id: { $eq: userId },
      type_id: { $eq: typeId },
    };
    if (lastId) {
      query.id = { $gt: lastId };
    }
    const entities = await this.repository.find(
      this.opName('readByUserIdAndTypeIdFromLast'),
      query,
      {
        limit,
        sort: [
          { id: 'asc' },
        ],
      },
      context,
    );
    return this.mapper.fromEntities(entities);
  }

  public async updateStatusById(
    id: string,
    status: OutgoingTelegramMessageStatus,
    context: Context,
  ): Promise<void> {
    const query: Where<OutgoingTelegramMessageDBEntity> = {
      id: { $eq: id },
    };
    await this.repository.update(
      this.opName('updateStatusById'),
      query,
      { status: { $set: status } },
      context,
    );
  }

  private opName(name: string): string {
    return `${OutgoingTelegramMessagesRepository.name}.${name}`;
  }
}
