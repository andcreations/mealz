import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  GenerateStartLinkRequestV1,
  TelegramUsersTransporter,
} from '@mealz/backend-telegram-users-service-api';

import { GenerateStartLinkGWResponseV1Impl } from '../dtos';


@Injectable()
export class TelegramUsersGWService {
  public constructor(
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
  ) {}

  public async generateStartLinkV1(
    userId: string,
    context: Context,
  ): Promise<GenerateStartLinkGWResponseV1Impl> {
    const request: GenerateStartLinkRequestV1 = {
      userId,
    };
    const response = await this.telegramUsersTransporter.generateStartLinkV1(
      request,
      context,
    );
    return {
      link: response.link,
    };
  }
}