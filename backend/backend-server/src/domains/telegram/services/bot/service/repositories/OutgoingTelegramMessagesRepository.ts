import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { DBRepository, InjectDBRepository } from '@mealz/backend-db';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';

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

  private opName(name: string): string {
    return `${OutgoingTelegramMessagesRepository.name}.${name}`;
  }
}
