import { Controller, Post, Body } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import { 
  Auth, 
  ClientIp, 
  GWContext, 
  GWUser, 
  UserAgent,
} from '@mealz/backend-gateway-common';
import { EVENT_LOG_V1_URL } from '@mealz/backend-event-log-gateway-api';

import { LogEventsGWRequestV1Impl } from '../dtos';
import { EventLogGWService } from '../services';

@Controller(EVENT_LOG_V1_URL)
export class EventLogGWController {
  public constructor(
    private readonly eventLogLogGWService: EventLogGWService,
  ) {}

  @Post()
  @Auth()
  public async logEventsV1(
    @Body() gwRequest: LogEventsGWRequestV1Impl,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
    @ClientIp() clientIp: string,
    @UserAgent() userAgent: string,
  ): Promise<void> {
    await this.eventLogLogGWService.logEventsV1(
      gwRequest,
      gwUser,
      clientIp,
      userAgent,
      context,
    );
  }
}
