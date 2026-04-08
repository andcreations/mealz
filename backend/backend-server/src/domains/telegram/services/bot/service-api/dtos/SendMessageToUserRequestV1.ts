import { TelegramAnonymousMessage } from '@andcreations/telegram-bot';

export interface SendMessageToUserRequestV1Action {
  // Action identifier
  id: string;

  // Action title
  title: string;
}

export interface SendMessageToUserRequestV1 {
  // User identifier
  userId: string;

  // Type identifier
  messageTypeId: string;

  // Message to send
  message: TelegramAnonymousMessage;

  // Actions the user can perform
  actions?: SendMessageToUserRequestV1Action[];
}