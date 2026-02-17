import { TelegramAnonymousMessage } from '@andcreations/telegram-bot';

export interface SendMessageToUserRequestV1 {
  // User identifier
  userId: string;

  // Type identifier
  messageTypeId: string;

  // Message to send
  message: TelegramAnonymousMessage;
}