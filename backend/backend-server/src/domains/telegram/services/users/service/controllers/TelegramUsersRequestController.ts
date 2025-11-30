import { Context } from '@mealz/backend-core';
import { RequestController, RequestHandler } from '@mealz/backend-transport';
import {
  TelegramUsersRequestTopics,
} from '@mealz/backend-telegram-users-service-api';

import { TelegramUsersRequestService } from '../services';

@RequestController()
export class TelegramUsersRequestController {
  public constructor(
    private readonly telegramUsersRequestService: TelegramUsersRequestService,
  ) {}
}