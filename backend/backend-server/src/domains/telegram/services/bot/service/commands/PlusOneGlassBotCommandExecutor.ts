import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';

import { TelegramBotCommand, TelegramBotCommandExecutor } from '../types';
import { TelegramBotClient } from '../services';

@Injectable()
export class PlusOneGlassBotCommandExecutor extends TelegramBotCommandExecutor {
  private static readonly NAME = 'glass';

  public constructor(
    private readonly logger: Logger,
    telegramBotClient: TelegramBotClient,
  ) {
    super(
      {
        name: PlusOneGlassBotCommandExecutor.NAME,
        description: 'Log glass of water intake',
        addToCommmandList: true,
      },
      telegramBotClient,
    );
  }
  
  public async execute(
    command: TelegramBotCommand,
    context: Context,
  ): Promise<void> {
  }
}
