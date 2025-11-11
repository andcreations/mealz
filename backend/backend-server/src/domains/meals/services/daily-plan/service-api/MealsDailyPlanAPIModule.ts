import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { MEALS_DAILY_PLAN_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import {
  MEALS_DAILY_PLAN_DOMAIN,
  MEALS_DAILY_PLAN_SERVICE,
} from './domain-and-service';
import { MealsDailyPlanTransporter } from './MealsDailyPlanTransporter';

export interface MealsDailyPlanAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class MealsDailyPlanAPIModule {
  public static forRoot(
    options: MealsDailyPlanAPIModuleOptions,
  ): DynamicModule {
    return {
      module: MealsDailyPlanAPIModule,
      providers: [
        {
          provide: MEALS_DAILY_PLAN_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: MEALS_DAILY_PLAN_DOMAIN,
            service: MEALS_DAILY_PLAN_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        MealsDailyPlanTransporter,
      ],
      exports: [
        MealsDailyPlanTransporter,
      ],
    };
  }
}