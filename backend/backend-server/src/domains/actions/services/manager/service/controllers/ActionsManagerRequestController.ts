import { Context } from '@mealz/backend-core';
import {
  RequestHandler,
  RequestController,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  ActionsManagerRequestTopics,
  CreateActionRequestV1,
  CreateActionResponseV1,
  RunActionRequestV1,
} from '@mealz/backend-actions-manager-service-api';

import { ActionsManagerService } from '../services';

@RequestController()
export class ActionsManagerRequestController {
  public constructor(
    private readonly actionsManagerService: ActionsManagerService,
  ) {}

  @RequestHandler(ActionsManagerRequestTopics.CreateActionV1)
  public async createActionV1(
    request: CreateActionRequestV1,
    context: Context,
  ): Promise<CreateActionResponseV1> {
    return this.actionsManagerService.createActionV1(request, context);
  }

  @RequestHandler(ActionsManagerRequestTopics.RunActionV1)
  public async runActionV1(
    request: RunActionRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.actionsManagerService.runActionV1(request, context);
  }
}