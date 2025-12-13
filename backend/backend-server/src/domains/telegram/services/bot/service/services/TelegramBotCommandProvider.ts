import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';

import { TELEGRAM_BOT_COMMAND_TYPES } from '../commands';
import { TelegramBotCommandExecutor } from '../types';

@Injectable()
export class TelegramBotCommandProvider implements OnModuleInit {
  private readonly commands: Record<string, TelegramBotCommandExecutor> = {};

  public constructor(
    private readonly logger: Logger,
    private readonly moduleRef: ModuleRef,
  ) {}

  public async onModuleInit(): Promise<void> {
    for (const commandType of TELEGRAM_BOT_COMMAND_TYPES) {
      const commandExecutor = this.moduleRef.get(commandType);
      this.logger.info('Registering Telegram bot command', {
        ...BOOTSTRAP_CONTEXT,
        name: commandExecutor.getName(),
      });
      this.commands[commandExecutor.getName()] = commandExecutor;
    }
  }

  public getCommandExecutor(
    name: string,
  ): TelegramBotCommandExecutor | undefined {
    return this.commands[name];
  }
}