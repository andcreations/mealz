import { Injectable } from '@nestjs/common';
import { TelegramAnonymousMessage } from '@andcreations/telegram-bot';
import { Context } from '@mealz/backend-core';
import { createTranslation, TranslateFunc } from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';
import { UsersCrudTransporter } from '@mealz/backend-users-crud-service-api';
import {
  TelegramUsersTransporter,
} from '@mealz/backend-telegram-users-service-api';

import { TelegramBotCommand, TelegramBotCommandExecutor } from '../types';
import { TelegramBotClient } from '../services';
import {
  StartBotCommandExecutorTranslations,
} from './StartBotCommandExecutor.translations';

@Injectable()
export class StartBotCommandExecutor extends TelegramBotCommandExecutor {
  private static readonly NAME = 'start';
  private readonly translate: TranslateFunc;

  public constructor(
    private readonly logger: Logger,
    private readonly usersCrudTransporter: UsersCrudTransporter,
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
    telegramBotClient: TelegramBotClient,
  ) {
    super(
      {
        name: StartBotCommandExecutor.NAME,
        description: 'Start the bot',
        addToCommandList: false,
      },
      telegramBotClient,
    );
    this.translate = createTranslation(StartBotCommandExecutorTranslations);
  }

  public async execute(
    command: TelegramBotCommand,
    context: Context,
  ): Promise<void> {
    const token = command.args[0];
    const { update } = command

    // no token
    if (!token) {
      this.logger.error('No Telegram bot start token', {
        ...context,
        command,
      });
      await this.sendMessage(
        command,
        this.translate('no-start-token'),
        context,
      );
      return;
    }

    // verify token
    const response = await this.telegramUsersTransporter.verifyStartTokenV1(
      { token },
      context,
    );

    // invalid token
    if (!response.userId) {
      this.logger.error('Invalid Telegram bot start token', {
        ...context,
      });
      await this.sendMessage(
        command,
        this.translate('invalid-start-token'),
        context,
      );
      return;
    }

    // resolve user name
    let telegramUsername = 'Unknown';
    if (update.message.from.username) {
      telegramUsername = update.message.from.username;
    }
    if (update.message.from.first_name) {
      telegramUsername = update.message.from.first_name;
    }

    // upsert Telegram user
    await this.telegramUsersTransporter.upsertTelegramUserV1(
      { 
        userId: response.userId,
        telegramChatId: update.message.chat.id,
        telegramUserId: update.message.from.id,
        telegramUsername,
      },
      context,
    );

    // read user
    const { user } = await this.usersCrudTransporter.readUserByIdV1(
      { id: response.userId },
      context,
    );

    const message: TelegramAnonymousMessage = {
      text: this.translate('welcome', user.firstName),
    };
    await this.sendMessage(command, message, context);
  }
}