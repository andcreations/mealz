import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import { UserRole } from '@mealz/backend-api';
import { Auth, GWContext, GWUser, Roles } from '@mealz/backend-gateway-common';
import {
  HYDRATION_LOG_V1_URL,
} from '@mealz/backend-hydration-log-gateway-api';

import { 
  LogHydrationGWRequestV1Impl,
  ReadHydrationLogsByDateRangeQueryParamsV1Impl,
  ReadHydrationLogsByDateRangeGWResponseV1Impl,
} from '../dtos';
import { HydrationLogGWService } from '../services';

@Controller(HYDRATION_LOG_V1_URL)
export class HydrationLogGWController {
  public constructor(
    private readonly hydrationLogGWService: HydrationLogGWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('by-date-range')
  public async readByDateRangeV1(
    @Query() gwParams: ReadHydrationLogsByDateRangeQueryParamsV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<ReadHydrationLogsByDateRangeGWResponseV1Impl> {
    ReadHydrationLogsByDateRangeQueryParamsV1Impl.validate(gwParams);
    return this.hydrationLogGWService.readByDateRangeV1(
      gwParams,
      gwUser.id,
      context,
    );
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Post()
  public async logHydrationV1(
    @Body() gwRequest: LogHydrationGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<void> {
    return this.hydrationLogGWService.logHydrationV1(
      gwRequest,
      gwUser.id,
      context,
    );
  }
}