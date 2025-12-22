import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import {
  ReadManyMealDailyPlansRequestV1,
  ReadManyMealDailyPlansResponseV1,
  CreateMealDailyPlanRequestV1,
  CreateMealDailyPlanResponseV1,
  UpdateMealDailyPlanRequestV1,
  ReadUserCurrentMealDailyPlanRequestV1,
  ReadUserCurrentMealDailyPlanResponseV1,
} from '@mealz/backend-meals-daily-plan-service-api';

import { MealDailyPlanByIdNotFoundError } from '../errors';
import { MealsDailyPlanCrudRepository } from '../repositories';

@Injectable()
export class MealsDailyPlanCrudService {
  public constructor(
    private readonly mealsDailyPlanCrudRepository: MealsDailyPlanCrudRepository,
  ) {}

  public async readManyMealDailyPlansV1(
    request: ReadManyMealDailyPlansRequestV1,
    context: Context,
  ): Promise<ReadManyMealDailyPlansResponseV1> {
    const DEFAULT_LIMIT = 100;
    const mealDailyPlans = await this.mealsDailyPlanCrudRepository.readMany(
      request.userId,
      request.limit ?? DEFAULT_LIMIT,
      context,
    );
    return { mealDailyPlans };
  }

  public async createMealDailyPlanV1(
    request: CreateMealDailyPlanRequestV1,
    context: Context,
  ): Promise<CreateMealDailyPlanResponseV1> {
    const { id } = await this.mealsDailyPlanCrudRepository.create(
      request.mealDailyPlan,
      context,
    );
    return { id };
  }

  public async updateMealDailyPlanV1(
    request: UpdateMealDailyPlanRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    const existing = await this.mealsDailyPlanCrudRepository.findById(
      request.mealDailyPlan.id,
      context,
    );
    if (!existing) {
      throw new MealDailyPlanByIdNotFoundError(request.mealDailyPlan.id);
    }
    await this.mealsDailyPlanCrudRepository.update(
      request.mealDailyPlan,
      context,
    );
    return {};
  }

  public async readUserCurrentMealDailyPlanV1(
    request: ReadUserCurrentMealDailyPlanRequestV1,
    context: Context,
  ): Promise<ReadUserCurrentMealDailyPlanResponseV1> {
    const mealDailyPlan = await this.mealsDailyPlanCrudRepository.readCurrent(
      request.userId,
      context,
    );
    return { mealDailyPlan };
  }
}