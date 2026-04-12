import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { EventTransporter } from '@mealz/backend-transport';

import { HYDRATION_LOG_EVENT_TRANSPORTER_TOKEN } from './inject-tokens';
import { HydrationLogEventTopics } from './HydrationLogEventTopics';
import { HydrationLoggedExternallyEventV1 } from './dtos';

@Injectable()
export class HydrationLogEmitter {
  public constructor(
    @Inject(HYDRATION_LOG_EVENT_TRANSPORTER_TOKEN)
    private readonly eventTransporter: EventTransporter,
  ) {}

  public async hydrationLoggedExternallyV1(
    event: HydrationLoggedExternallyEventV1,
    context: Context,
  ): Promise<void> {
    await this.eventTransporter.emitEvent(
      HydrationLogEventTopics.HydrationLoggedExternallyV1,
      event,
      context,
    );
  }
}