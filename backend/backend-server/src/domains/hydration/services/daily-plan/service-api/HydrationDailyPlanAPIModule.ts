import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import {
  HYDRATION_DAILY_PLAN_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import {
  HYDRATION_DAILY_PLAN_DOMAIN,
  HYDRATION_DAILY_PLAN_SERVICE,
} from './domain-and-service';
import {
  HydrationDailyPlanTransporter,
} from './HydrationDailyPlanTransporter';

export interface HydrationDailyPlanAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class HydrationDailyPlanAPIModule {
  public static forRoot(
    options: HydrationDailyPlanAPIModuleOptions,
  ): DynamicModule {
    return {
      module: HydrationDailyPlanAPIModule,
      providers: [
        {
          provide: HYDRATION_DAILY_PLAN_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: HYDRATION_DAILY_PLAN_DOMAIN,
            service: HYDRATION_DAILY_PLAN_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        HydrationDailyPlanTransporter,
      ],
      exports: [
        HydrationDailyPlanTransporter,
      ],
    };
  }
}