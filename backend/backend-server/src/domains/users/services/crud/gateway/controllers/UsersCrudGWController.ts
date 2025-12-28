import { Controller, Post, Body } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { UserRole } from '@mealz/backend-api';
import { Auth, GWContext, Roles } from '@mealz/backend-gateway-common';
import { USERS_CRUD_V1_URL } from '@mealz/backend-users-crud-gateway-api';

import { CreateUserGWRequestV1Impl } from '../dtos';
import { UsersCrudGWService } from '../services';

@Controller(USERS_CRUD_V1_URL)
export class UsersCrudGWController {
  public constructor(
    private readonly usersCrudGWService: UsersCrudGWService,
  ) {}

  @Post()
  @Auth()
  @Roles([UserRole.ADMIN])
  public async createUserV1(
    @Body() gwRequest: CreateUserGWRequestV1Impl,
    @GWContext() context: Context,
  ): Promise<void> {
    await this.usersCrudGWService.createUserV1(gwRequest, context);
  }
}