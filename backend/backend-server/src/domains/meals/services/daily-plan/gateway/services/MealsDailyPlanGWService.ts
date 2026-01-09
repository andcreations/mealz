import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  CreateMealDailyPlanRequestV1,
  UpdateMealDailyPlanRequestV1,
  MealsDailyPlanTransporter,
  ReadManyMealDailyPlansRequestV1,
} from '@mealz/backend-meals-daily-plan-service-api';

import {
  ReadMealDailyPlansQueryParamsV1Impl,
  ReadMealDailyPlansGWResponseV1Impl,
  CreateMealDailyPlanGWRequestV1Impl,
  CreateMealDailyPlanGWResponseV1Impl,
  UpdateMealDailyPlanGWRequestV1Impl,
  UpdateMealDailyPlanGWResponseV1Impl,
} from '../dtos';
import { GWMealDailyPlanMapper } from './GWMealDailyPlanMapper';

@Injectable()
export class MealsDailyPlanGWService {

  public constructor(
    private readonly mealsDailyPlanTransporter: MealsDailyPlanTransporter,
    private readonly gwMealDailyPlanMapper: GWMealDailyPlanMapper,
  ) {}

  public async readManyV1(
    gwParams: ReadMealDailyPlansQueryParamsV1Impl,
    userId: string,
    context: Context,
  ): Promise<ReadMealDailyPlansGWResponseV1Impl> {
    const request: ReadManyMealDailyPlansRequestV1 = {
      userId,
      limit: gwParams.limit,
    };
    const { mealDailyPlans} = await this
      .mealsDailyPlanTransporter
      .readManyMealDailyPlansV1(
        request,
        context,
      );
    return {
      mealDailyPlans: mealDailyPlans.map(mealDailyPlan => {
        return this.gwMealDailyPlanMapper.fromMealDailyPlan(mealDailyPlan);
      }),
    };
  }
  public async createV1(
    gwRequest: CreateMealDailyPlanGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<CreateMealDailyPlanGWResponseV1Impl> {
    const request: CreateMealDailyPlanRequestV1 = {
      mealDailyPlan: this.gwMealDailyPlanMapper.fromGWMealDailyPlanForCreation(
        userId,
        gwRequest.mealDailyPlan,
      ),
    };
    const { id } = await this.mealsDailyPlanTransporter.createMealDailyPlanV1(
      request,
      context,
    );
    return { id };
  }

  public async updateV1(
    mealDailyPlanId: string,
    gwRequest: UpdateMealDailyPlanGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<UpdateMealDailyPlanGWResponseV1Impl> {
    const request: UpdateMealDailyPlanRequestV1 = {
      mealDailyPlan: this.gwMealDailyPlanMapper.fromGWMealDailyPlanForUpdate(
        mealDailyPlanId,
        userId,
        gwRequest.mealDailyPlan,
      ),
    };
    await this.mealsDailyPlanTransporter.updateMealDailyPlanV1(
      request,
      context,
    );
    return {};
  }
}