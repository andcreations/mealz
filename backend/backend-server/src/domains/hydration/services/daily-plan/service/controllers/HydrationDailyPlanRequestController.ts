import {
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import { Context } from '@mealz/backend-core';

import { HydrationDailyPlanCrudService } from '../services';

@RequestController()
export class HydrationDailyPlanRequestController {
  public constructor(
    private readonly crudService: HydrationDailyPlanCrudService,
  ) {}
}