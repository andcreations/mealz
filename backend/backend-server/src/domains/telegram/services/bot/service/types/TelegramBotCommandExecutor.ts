import { TelegramAnonymousMessage } from '@andcreations/telegram-bot';
import { Context } from '@mealz/backend-core';

import { TelegramBotCommand } from './TelegramBotCommand';
import { TelegramBotClient } from '../services';

export abstract class TelegramBotCommandExecutor {
  protected constructor(
    private readonly name: string,
    private readonly telegramBotClient: TelegramBotClient,
  ) {
  }

  public getName(): string {
    return this.name;
  }

  protected async reply(
    command: TelegramBotCommand,
    message: TelegramAnonymousMessage,
    context: Context,
  ): Promise<void> {
    await this.telegramBotClient.sendMessage(
      {
         ...message,
         chat_id: command.update.message.chat.id,
      },
      context,
    );
  }

  public abstract execute(
    command: TelegramBotCommand,
    context: Context,
  ): Promise<void>;
}