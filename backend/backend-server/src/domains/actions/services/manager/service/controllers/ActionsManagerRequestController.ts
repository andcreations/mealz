import { Context } from '@mealz/backend-core';
import {
  RequestHandler,
  RequestController,
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import { ActionsManagerService } from '../services';

@RequestController()
export class ActionsManagerRequestController {
  public constructor(
    private readonly actionsManagerService: ActionsManagerService,
  ) {}
}