import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { MEALS_DAILY_PLAN_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsDailyPlanRequestTopics } from './MealsDailyPlanRequestTopics';
import {
  ReadManyMealDailyPlansRequestV1,
  ReadManyMealDailyPlansResponseV1,
  CreateMealDailyPlanRequestV1,
  CreateMealDailyPlanResponseV1,
  UpdateMealDailyPlanRequestV1,
  UpdateMealDailyPlanResponseV1,
} from './dtos';

@Injectable()
export class MealsDailyPlanTransporter {
  public constructor(
    @Inject(MEALS_DAILY_PLAN_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async readManyMealDailyPlansV1(
    request: ReadManyMealDailyPlansRequestV1,
    context: Context,
  ): Promise<ReadManyMealDailyPlansResponseV1> {
    return this.transporter.sendRequest<
      ReadManyMealDailyPlansRequestV1, ReadManyMealDailyPlansResponseV1
    >(
      MealsDailyPlanRequestTopics.ReadManyMealDailyPlansV1,
      request, context,
    );
  }

  public async createMealDailyPlanV1(
    request: CreateMealDailyPlanRequestV1,
    context: Context,
  ): Promise<CreateMealDailyPlanResponseV1> {
    return this.transporter.sendRequest<
      CreateMealDailyPlanRequestV1, CreateMealDailyPlanResponseV1
    >(
      MealsDailyPlanRequestTopics.CreateMealDailyPlanV1,
      request,
      context,
    );
  }

  public async updateMealDailyPlanV1(
    request: UpdateMealDailyPlanRequestV1,
    context: Context,
  ): Promise<UpdateMealDailyPlanResponseV1> {
    return this.transporter.sendRequest<
      UpdateMealDailyPlanRequestV1, UpdateMealDailyPlanResponseV1
    >(
      MealsDailyPlanRequestTopics.UpdateMealDailyPlanV1,
      request,
      context,
    );
  } 
}