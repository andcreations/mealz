import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import {
  TelegramUsersTransporter,
} from '@mealz/backend-telegram-users-service-api';

import { TelegramBotCommand, TelegramBotCommandExecutor } from '../types';
import { TelegramBotClient } from '../services';
import { TelegramAnonymousMessage } from '@andcreations/telegram-bot';

@Injectable()
export class StartBotCommandExecutor extends TelegramBotCommandExecutor {
  private static readonly COMMAND_NAME = 'start';

  public constructor(
    private readonly logger: Logger,
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
    telegramBotClient: TelegramBotClient,
  ) {
    super('start', telegramBotClient);
  }

  public async execute(
    command: TelegramBotCommand,
    context: Context,
  ): Promise<void> {
    const token = command.args[0];
    if (!token) {
      this.logger.error('Start Telegram bot command without token', {
        ...context,
        command,
      });
      return;
    }

    const response = await this.telegramUsersTransporter.verifyStartTokenV1(
      { token },
      context,
    );
    if (!response.userId) {
      this.logger.error('Invalid Telegram bot start token', {
        ...context,
      });
      return;
    }

    const message: TelegramAnonymousMessage = {
      text: 'Hello, world!',
    };
    await this.reply(command, message, context);
  }
}