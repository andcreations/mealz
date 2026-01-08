import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  RequestTransporter,
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import {
  HYDRATION_LOG_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import { HydrationLogRequestTopics } from './HydrationLogRequestTopics';

@Injectable()
export class HydrationLogTransporter {
  public constructor(
    @Inject(HYDRATION_LOG_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}
}