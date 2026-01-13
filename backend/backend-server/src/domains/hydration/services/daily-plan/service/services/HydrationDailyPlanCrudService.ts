import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import { 
  ReadCurrentHydrationDailyPlanResponseV1,
  ReadCurrentHydrationDailyPlanRequestV1,
  ReadManyHydrationDailyPlansRequestV1,
  ReadManyHydrationDailyPlansResponseV1,
  CreateHydrationDailyPlanRequestV1, 
  CreateHydrationDailyPlanResponseV1,
  UpdateHydrationDailyPlanRequestV1,
} from '@mealz/backend-hydration-daily-plan-service-api';

import { HydrationDailyPlanByIdNotFoundError } from '../errors';
import { HydrationDailyPlanCrudRepository } from '../repositories';

@Injectable()
export class HydrationDailyPlanCrudService {
  public constructor(
    private readonly crudRepository: HydrationDailyPlanCrudRepository,
  ) {}


  public async readCurrentHydrationDailyPlanV1(
    request: ReadCurrentHydrationDailyPlanRequestV1,
    context: Context,
  ): Promise<ReadCurrentHydrationDailyPlanResponseV1> {
    const hydrationDailyPlan = await this.crudRepository.findByUserId(
      request.userId,
      context,
    );
    return { hydrationDailyPlan };
  }
  
  public async readManyHydrationDailyPlansV1(
    request: ReadManyHydrationDailyPlansRequestV1,
    context: Context,
  ): Promise<ReadManyHydrationDailyPlansResponseV1> {
    const DEFAULT_LIMIT = 100;
    const hydrationDailyPlans = await this.crudRepository.readMany(
      request.userId,
      request.limit ?? DEFAULT_LIMIT,
      context,
    );
    return { hydrationDailyPlans };
  }

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
    const existing = await this.crudRepository.findById(
      request.hydrationDailyPlan.id,
      context,
    );
    if (!existing || existing.userId !== request.hydrationDailyPlan.userId) {
      throw new HydrationDailyPlanByIdNotFoundError(
        request.hydrationDailyPlan.id,
      );
    }
    await this.crudRepository.update(
      request.hydrationDailyPlan,
      context,
    );
    return {};
  }
}