import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  CreateHydrationDailyPlanRequestV1,
  HydrationDailyPlanTransporter,
  ReadManyHydrationDailyPlansRequestV1,
  UpdateHydrationDailyPlanRequestV1,
} from '@mealz/backend-hydration-daily-plan-service-api';

import {
  ReadHydrationDailyPlansGWResponseV1Impl,
  CreateHydrationDailyPlanGWRequestV1Impl,
  CreateHydrationDailyPlanGWResponseV1Impl,
  HydrationDailyPlanV1APIReadManyParamsImpl,
  UpdateHydrationDailyPlanGWRequestV1Impl,
  UpdateHydrationDailyPlanGWResponseV1Impl,
} from '../dtos';
import { GWHydrationDailyPlanMapper } from './GWHydrationDailyPlanMapper';

@Injectable()
export class HydrationDailyPlanGWService {

  public constructor(
    private readonly hydrationDailyPlanTransporter:
      HydrationDailyPlanTransporter,
    private readonly gwHydrationDailyPlanMapper:
      GWHydrationDailyPlanMapper,
  ) {}


  public async readManyV1(
    gwParams: HydrationDailyPlanV1APIReadManyParamsImpl,
    userId: string,
    context: Context,
  ): Promise<ReadHydrationDailyPlansGWResponseV1Impl> {
    const request: ReadManyHydrationDailyPlansRequestV1 = {
      userId,
      limit: gwParams.limit,
    };
    const { hydrationDailyPlans } = await this
      .hydrationDailyPlanTransporter
      .readManyHydrationDailyPlansV1(
        request,
        context,
      );
    return {
      hydrationDailyPlans: hydrationDailyPlans.map(hydrationDailyPlan => {
        return this.gwHydrationDailyPlanMapper.fromHydrationDailyPlan(
          hydrationDailyPlan,
        );
      }),
    };
  }
  
  public async createV1(
    gwRequest: CreateHydrationDailyPlanGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<CreateHydrationDailyPlanGWResponseV1Impl> {
    const request: CreateHydrationDailyPlanRequestV1 = {
      hydrationDailyPlan: this
        .gwHydrationDailyPlanMapper
        .fromGWHydrationDailyPlanForCreation(
          userId,
          gwRequest.hydrationDailyPlan,
        ),
      };
    const { id } = await this
      .hydrationDailyPlanTransporter
      .createHydrationDailyPlanV1(
        request,
        context,
      );
    return { id };
  }

  public async updateV1(
    hydrationDailyPlanId: string,
    gwRequest: UpdateHydrationDailyPlanGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<UpdateHydrationDailyPlanGWResponseV1Impl> {
    const request: UpdateHydrationDailyPlanRequestV1 = {
      hydrationDailyPlan: this
        .gwHydrationDailyPlanMapper
        .fromGWHydrationDailyPlanForUpdate(
          hydrationDailyPlanId,
          userId,
          gwRequest.hydrationDailyPlan,
        ),
      };
    await this.hydrationDailyPlanTransporter.updateHydrationDailyPlanV1(
      request,
      context,
    );
    return {};
  }
}