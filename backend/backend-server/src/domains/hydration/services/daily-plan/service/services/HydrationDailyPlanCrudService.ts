import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import { 
  CreateHydrationDailyPlanRequestV1, 
  CreateHydrationDailyPlanResponseV1,
  UpdateHydrationDailyPlanRequestV1,
} from '@mealz/backend-hydration-daily-plan-service-api';

import { HydrationDailyPlanCrudRepository } from '../repositories';

@Injectable()
export class HydrationDailyPlanCrudService {
  public constructor(
    private readonly crudRepository: HydrationDailyPlanCrudRepository,
  ) {}

  public async createHydrationDailyPlanV1(
    request: CreateHydrationDailyPlanRequestV1,
    context: Context,
  ): Promise<CreateHydrationDailyPlanResponseV1> {
    const { id } = await this.crudRepository.create(
      request.hydrationDailyPlan,
      context,
    );
    return { id };
  }

  public async updateHydrationDailyPlanV1(
    request: UpdateHydrationDailyPlanRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    await this.crudRepository.update(
      request.hydrationDailyPlan,
      context,
    );
    return {};
  }
}