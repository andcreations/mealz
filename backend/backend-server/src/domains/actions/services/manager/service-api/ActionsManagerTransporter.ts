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
import { CreateActionRequestV1, CreateActionResponseV1, RunActionRequestV1 } from './dtos';

@Injectable()
export class ActionsManagerTransporter {
  public constructor(
    @Inject(ACTIONS_MANAGER_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async createActionV1(
    request: CreateActionRequestV1,
    context: Context,
  ): Promise<CreateActionResponseV1> {
    return this.transporter.sendRequest<
      CreateActionRequestV1, CreateActionResponseV1
    >(ActionsManagerRequestTopics.CreateActionV1, request, context);
  }

  public async runActionV1(
    request: RunActionRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      RunActionRequestV1, VoidTransporterResponse
    >(ActionsManagerRequestTopics.RunActionV1, request, context);
  }
}