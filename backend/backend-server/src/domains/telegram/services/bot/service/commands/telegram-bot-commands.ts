import { Provider, Type } from '@nestjs/common';
import { TelegramBotCommand } from '../types';

const TELEGRAM_BOT_COMMANDS: Type<TelegramBotCommand>[] = [];

export function getTelegramBotCommandProviders(): Provider[] {
  return [
    ...TELEGRAM_BOT_COMMANDS,
  ];
}