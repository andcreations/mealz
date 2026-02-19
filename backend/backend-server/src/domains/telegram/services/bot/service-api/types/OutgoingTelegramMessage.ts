import { TelegramAnonymousMessage } from '@andcreations/telegram-bot';
import { OutgoingTelegramMessageStatus } from './OutgoingTelegramMessageStatus';

export interface OutgoingTelegramMessage {
  id: string;
  userId: string;
  typeId: string;
  telegramChatId: number;
  telegramMessageId: number;
  content: TelegramAnonymousMessage;
  status: OutgoingTelegramMessageStatus;
  sentAt: number;
}
