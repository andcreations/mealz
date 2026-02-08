import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { createTranslation, TranslateFunc } from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';
import {
  TelegramUsersTransporter,
} from '@mealz/backend-telegram-users-service-api';
import {
  HydrationLogTransporter,
} from '@mealz/backend-hydration-log-service-api';

import { TelegramBotCommand, TelegramBotCommandExecutor } from '../types';
import { TelegramBotClient } from '../services';
import { 
  PlusOneGlassBotCommandExecutorTranslations,
} from './PlusOneGlassBotCommandExecutor.translations';

@Injectable()
export class PlusOneGlassBotCommandExecutor extends TelegramBotCommandExecutor {
  private static readonly NAME = 'glass';
  private readonly translate: TranslateFunc;

  public constructor(
    private readonly logger: Logger,
    telegramBotClient: TelegramBotClient,
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
    private readonly hydrationLogTransporter: HydrationLogTransporter,
  ) {
    super(
      {
        name: PlusOneGlassBotCommandExecutor.NAME,
        description: 'Log glass of water intake',
        addToCommandList: true,
      },
      telegramBotClient,
    );
    this.translate = createTranslation(
      PlusOneGlassBotCommandExecutorTranslations,
    );
  }
  
  public async execute(
    command: TelegramBotCommand,
    context: Context,
  ): Promise<void> {
    // read user
    const { telegramUser } = await this.telegramUsersTransporter
      .readTelegramUserByChatIdV1(
        { telegramChatId: command.update.message.chat.id },
        context,
      );

    // log
    this.logger.info('Logging hydration through Telegram bot', {
      ...context,
      userId: telegramUser.userId,
    });

    // log hydration
    await this.hydrationLogTransporter.logHydrationV1(
      {
        userId: telegramUser.userId,
        glassFraction: 'full',
      },
      context,
    );

    // reply
    await this.sendMessage(
      command,
      this.translate('glass-logged'),
      context,
    );
  }
}
