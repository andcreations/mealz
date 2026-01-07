import { Injectable } from '@nestjs/common';
import { 
  HydrationDailyPlan,
  HydrationDailyPlanForCreation,
  HydrationDailyPlanForUpdate,
} from '@mealz/backend-hydration-daily-plan-service-api';
import {
  GWHydrationDailyPlan,
  GWHydrationDailyPlanForCreation,
  GWHydrationDailyPlanForUpdate,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

@Injectable()
export class GWHydrationDailyPlanMapper {
  public fromGWHydrationDailyPlanForCreation(
    userId: string,
    gwHydrationDailyPlan: GWHydrationDailyPlanForCreation,
  ): HydrationDailyPlanForCreation {
    return {
      userId,
    };
  }

  public fromGWHydrationDailyPlanForUpdate(
    hydrationDailyPlanId: string,
    userId: string,
    gwHydrationDailyPlan: GWHydrationDailyPlanForUpdate,
  ): HydrationDailyPlanForUpdate {
    return {
      id: hydrationDailyPlanId,
      userId,
    };
  }

  public fromHydrationDailyPlan(
    hydrationDailyPlan: HydrationDailyPlan,
  ): GWHydrationDailyPlan {
    return {
      id: hydrationDailyPlan.id,
      createdAt: hydrationDailyPlan.createdAt,
    };
  }
}