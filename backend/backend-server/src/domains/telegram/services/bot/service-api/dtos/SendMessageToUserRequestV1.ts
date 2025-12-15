import { TelegramAnonymousMessage } from '@andcreations/telegram-bot';

export interface SendMessageToUserRequestV1 {
  // User identifier
  userId: string;

  // Message to send
  message: TelegramAnonymousMessage;
}