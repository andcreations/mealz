import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  RequestTransporter,
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import {
  ACTIONS_MANAGER_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import {
  ActionsManagerRequestTopics,
} from './ActionsManagerRequestTopics';

@Injectable()
export class ActionsManagerTransporter {
  public constructor(
    @Inject(ACTIONS_MANAGER_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}
}