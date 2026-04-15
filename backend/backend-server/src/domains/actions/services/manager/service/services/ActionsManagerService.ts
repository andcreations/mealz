import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { 
  RequestTransporterResolver,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  ActionStatus,
  CreateActionRequestV1,
  CreateActionResponseV1,
  RunActionRequestV1,
} from '@mealz/backend-actions-manager-service-api';

import { ActionNotFoundError } from '../errors';
import { ActionCrudRepository } from '../repositories';

@Injectable()
export class ActionsManagerService {
  public constructor(
    private readonly logger: Logger,
    private readonly actionCrudRepository: ActionCrudRepository,
  ) {}

  public async createActionV1(
    request: CreateActionRequestV1,
    context: Context,
  ): Promise<CreateActionResponseV1> {
    const { domain, service, topic, payload } = request.action;
    const { id } = await this.actionCrudRepository.create(
      domain,
      service,
      topic,
      payload,
      context,
    );
    return { id };
  }

  public async runActionV1(
    request: RunActionRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    const { actionId } = request;

    // read action
    const action = await this.actionCrudRepository.read(actionId, context);
    if (!action) {
      throw new ActionNotFoundError(actionId);
    }
    if (action.status !== ActionStatus.Pending) {
      this.logger.warning(
        'Attempt to run non-pending action',
        {
          ...context,
          actionId,
        },
      );
      return {};
    }

    // resolve transporter
    const transporter = RequestTransporterResolver.forService({
      domain: action.domain,
      service: action.service,
    });

    // send request
    try {
      await transporter.sendRequest(action.topic, action.payload, context);
      this.actionCrudRepository.updateStatus(
        actionId,
        ActionStatus.Finished,
        undefined,
        context,
      );
    } catch (error) {
      this.actionCrudRepository.updateStatus(
        actionId,
        ActionStatus.Failed,
        error.message,
        context,
      );
      throw error;
    }

    return {};
  }
}