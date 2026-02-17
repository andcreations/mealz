import {
  OutgoingTelegramMessage,
} from '@mealz/backend-telegram-bot-service-api';

export type OutgoingTelegramMessageForCreation =
  Omit<OutgoingTelegramMessage, 'id' | 'sentAt'>;