import { Controller, Get, Patch, Body } from '@nestjs/common';
import { AuthUser } from '@mealz/backend-gateway-core';
import { Context } from '@mealz/backend-core';
import { UserRole } from '@mealz/backend-api';
import { Auth, GWContext, Roles } from '@mealz/backend-gateway-common';
import { GWUser } from '@mealz/backend-gateway-common';
import {
  TELEGRAM_USERS_V1_URL,
} from '@mealz/backend-telegram-users-gateway-api';

import { 
  ReadTelegramUserGWResponseV1Impl,
  GenerateStartLinkGWResponseV1Impl,
  PatchTelegramUserGWRequestV1Impl,
} from '../dtos';
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

  @Get()
  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  public async readTelegramUserV1(
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<ReadTelegramUserGWResponseV1Impl> {
    return await this.telegramUsersGWService.readTelegramUserV1(
      gwUser.id,
      context,
    );
  }

  @Patch()
  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  public async patchTelegramUserV1(
    @Body() gwRequest: PatchTelegramUserGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<void> {
    return await this.telegramUsersGWService.patchTelegramUserV1(
      gwUser.id,
      gwRequest,
      context,
    );
  }
}