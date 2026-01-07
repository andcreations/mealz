import { Injectable } from '@nestjs/common';
import { decode, encode } from '@mealz/backend-db';
import {
  HydrationDailyPlan,
} from '@mealz/backend-hydration-daily-plan-service-api';

import { HydrationDailyPlanDetailsV1 } from '../../types';

export type HydrationDailyPlanForBuffer = Omit<HydrationDailyPlan, 
  | 'id'
  | 'userId' 
  | 'createdAt'
>;

@Injectable()
export class HydrationDailyPlanDetailsV1Mapper {
  public toBuffer(hydrationDailyPlan: HydrationDailyPlanForBuffer): Buffer {
    const details: HydrationDailyPlanDetailsV1 = {};
    const encoded = encode(details);
    return Buffer.from(encoded);
  }

  public fromBuffer(buffer: Buffer): HydrationDailyPlanForBuffer {
    const details = decode(buffer) as HydrationDailyPlanDetailsV1;
    return {};
  }
}