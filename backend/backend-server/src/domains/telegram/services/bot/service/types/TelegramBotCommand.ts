import { TelegramUpdate } from '@andcreations/telegram-bot';

export interface TelegramBotCommand {
  command: string;
  args: string[];
  update: TelegramUpdate;
}