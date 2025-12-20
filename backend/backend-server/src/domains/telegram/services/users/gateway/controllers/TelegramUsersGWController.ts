import { Controller, Get } from '@nestjs/common';
import { AuthUser } from '@mealz/backend-gateway-core';
import { Context } from '@mealz/backend-core';
import { UserRole } from '@mealz/backend-api';
import { Auth, GWContext, Roles } from '@mealz/backend-gateway-common';
import { GWUser } from '@mealz/backend-gateway-common';
import {
  TELEGRAM_USERS_V1_URL,
} from '@mealz/backend-telegram-users-gateway-api';

import { GenerateStartLinkGWResponseV1Impl } from '../dtos';
import { TelegramUsersGWService } from '../services';

@Controller(TELEGRAM_USERS_V1_URL)
export class TelegramUsersGWController {
  public constructor(
    private readonly telegramUsersGWService: TelegramUsersGWService,
  ) {}

  @Get('start-link')
  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  public async generateStartLinkV1(
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<GenerateStartLinkGWResponseV1Impl> {
    return await this.telegramUsersGWService.generateStartLinkV1(
      gwUser.id,
      context,
    );
  }
}