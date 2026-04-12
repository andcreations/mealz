import { Context } from '@mealz/backend-core';
import { EventController, EventHandler } from '@mealz/backend-transport';

import { 
  HydrationLogEventTopics,
  HydrationLoggedExternallyEventV1,
} from '@mealz/backend-hydration-log-service-api';
import { HydrationLogEventService } from '../services';

@EventController()
export class HydrationLogEventController {
  public constructor(
    private readonly hydrationLogEventService: HydrationLogEventService,
  ) {}

  @EventHandler(HydrationLogEventTopics.HydrationLoggedExternallyV1)
  public async hydrationLoggedExternallyV1(
    event: HydrationLoggedExternallyEventV1,
    context: Context,
  ): Promise<void> {
    await this.hydrationLogEventService.hydrationLoggedExternallyV1(
      event, 
      context,
    );
  }
}