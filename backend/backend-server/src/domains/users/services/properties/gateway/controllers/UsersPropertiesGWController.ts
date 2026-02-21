import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserRole } from '@mealz/backend-api';
import { AuthUser } from '@mealz/backend-gateway-core';
import { Context } from '@mealz/backend-core';
import { Auth, GWContext, GWUser, Roles } from '@mealz/backend-gateway-common';
import { 
  USERS_PROPERTIES_V1_URL,
} from '@mealz/backend-users-properties-gateway-api';

import {
  ReadUserPropertiesByPropertyIdGWResponseV1Impl,
  UpsertUserPropertiesByPropertyIdGWRequestV1Impl,
  UpsertUserPropertiesByPropertyIdGWResponseV1Impl,
} from '../dtos';
import { UsersPropertiesGWService } from '../services';

@Controller(USERS_PROPERTIES_V1_URL)
export class UsersPropertiesGWController {
  public constructor(
    private readonly usersPropertiesGWService: UsersPropertiesGWService,
  ) {}

  @Get(':propertyId')
  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  public async readByPropertyIdV1(
    @Param('propertyId') propertyId: string,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<ReadUserPropertiesByPropertyIdGWResponseV1Impl> {
    return this.usersPropertiesGWService.readByPropertyIdV1(
      propertyId,
      gwUser.id,
      context,
    );
  }

  @Put(':propertyId')
  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  public async upsertByPropertyIdV1(
    @Param('propertyId') propertyId: string,
    @Body() gwRequest: UpsertUserPropertiesByPropertyIdGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<UpsertUserPropertiesByPropertyIdGWResponseV1Impl> {
    return this.usersPropertiesGWService.upsertByPropertyIdV1(
      gwRequest,
      propertyId,
      gwUser.id,
      context,
    );
  }
}
