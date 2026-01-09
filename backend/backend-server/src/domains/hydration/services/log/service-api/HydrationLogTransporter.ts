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
import {
  ReadHydrationLogsByDateRangeRequestV1,
  ReadHydrationLogsByDateRangeResponseV1,
  LogHydrationRequestV1,
} from './dtos';

@Injectable()
export class HydrationLogTransporter {
  public constructor(
    @Inject(HYDRATION_LOG_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async readHydrationLogsByDateRangeV1(
    request: ReadHydrationLogsByDateRangeRequestV1,
    context: Context,
  ): Promise<ReadHydrationLogsByDateRangeResponseV1> {
    return this.transporter.sendRequest<
      ReadHydrationLogsByDateRangeRequestV1,
      ReadHydrationLogsByDateRangeResponseV1
    >(
      HydrationLogRequestTopics.ReadHydrationLogsByDateRangeV1,
      request, context,
    );
  }

  public async logHydrationV1(
    request: LogHydrationRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      LogHydrationRequestV1, VoidTransporterResponse
    >(
      HydrationLogRequestTopics.LogHydrationV1,
      request,
      context,
    );
  }
}