import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { TelegramUser } from '@mealz/backend-telegram-users-service-api';

import { TelegramUsersRepository } from '../repositories';

@Injectable()
export class TelegramUsersService {
  public constructor(
    private readonly telegramUsersRepository: TelegramUsersRepository,
  ) {}

  public async upsertTelegramUser(
    user: TelegramUser,
    context: Context,
  ): Promise<void> {
    return this.telegramUsersRepository.upsertTelegramUser(user, context);
  }

  public async readTelegramUser(
    userId: string,
    context: Context,
  ): Promise<TelegramUser> {
    return this.telegramUsersRepository.readTelegramUser(userId, context);
  }
}