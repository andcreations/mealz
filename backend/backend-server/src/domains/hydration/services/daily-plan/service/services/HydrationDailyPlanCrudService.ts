import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { VoidTransporterResponse } from '@mealz/backend-transport';

import { HydrationDailyPlanCrudRepository } from '../repositories';

@Injectable()
export class HydrationDailyPlanCrudService {
  public constructor(
    private readonly crudRepository: HydrationDailyPlanCrudRepository,
  ) {}
}