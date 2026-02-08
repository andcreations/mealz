import { TelegramAnonymousMessage } from '@andcreations/telegram-bot';
import { Context } from '@mealz/backend-core';

import { TelegramBotCommand } from './TelegramBotCommand';
import { TelegramBotClient } from '../services';
import { 
  TelegramBotCommandExecutorInput,
} from './TelegramBotCommandExecutorInput';

export abstract class TelegramBotCommandExecutor {
  protected constructor(
    private readonly input: TelegramBotCommandExecutorInput,
    private readonly telegramBotClient: TelegramBotClient,
  ) {
  }

  public getName(): string {
    return this.input.name;
  }

  public getDescription(): string {
    return this.input.description;
  }

  public getAddToCommandList(): boolean {
    return this.input.addToCommandList;
  }

  protected async sendMessage(
    command: TelegramBotCommand,
    message: TelegramAnonymousMessage |  string,
    context: Context,
  ): Promise<void> {
    if (typeof message === 'string') {
      message = {
        text: message,
      };
    }
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