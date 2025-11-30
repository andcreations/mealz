import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { TELEGRAM_USERS_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { TelegramUsersRequestTopics } from './TelegramUsersRequestTopics';

export class TelegramUsersTransporter {
  public constructor(
    @Inject(TELEGRAM_USERS_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}
}