import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  CreateMealDailyPlanRequestV1,
  UpdateMealDailyPlanRequestV1,
  MealsDailyPlanTransporter,
  ReadManyMealDailyPlansRequestV1,
} from '@mealz/backend-meals-daily-plan-service-api';

import {
  MealsDailyPlanV1APIReadManyParamsImpl,
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
    private readonly transporter: MealsDailyPlanTransporter,
    private readonly mapper: GWMealDailyPlanMapper,
  ) {}

  public async readManyV1(
    gwParams: MealsDailyPlanV1APIReadManyParamsImpl,
    userId: string,
    context: Context,
  ): Promise<ReadMealDailyPlansGWResponseV1Impl> {
    const request: ReadManyMealDailyPlansRequestV1 = {
      userId,
      limit: gwParams.limit,
    };
    const response = await this.transporter.readManyMealDailyPlansV1(
      request,
      context,
    );
    return {
      mealDailyPlans: response.mealDailyPlans.map(mealDailyPlan => {
        return this.mapper.fromMealDailyPlan(mealDailyPlan);
      }),
    };
  }
  public async createV1(
    gwRequest: CreateMealDailyPlanGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<CreateMealDailyPlanGWResponseV1Impl> {
    const request: CreateMealDailyPlanRequestV1 = {
      mealDailyPlan: this.mapper.fromGWMealDailyPlanForCreation(
        userId,
        gwRequest.mealDailyPlan,
      ),
    };
    const { id } = await this.transporter.createMealDailyPlanV1(
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
      mealDailyPlan: this.mapper.fromGWMealDailyPlanForUpdate(
        mealDailyPlanId,
        userId,
        gwRequest.mealDailyPlan,
      ),
    };
    await this.transporter.updateMealDailyPlanV1(
      request,
      context,
    );
    return {};
  }
}