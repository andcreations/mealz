import {
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import { Context } from '@mealz/backend-core';

import { HydrationLogCrudService } from '../services';

@RequestController()
export class HydrationLogRequestController {
  public constructor(
    private readonly crudService: HydrationLogCrudService,
  ) {}
}