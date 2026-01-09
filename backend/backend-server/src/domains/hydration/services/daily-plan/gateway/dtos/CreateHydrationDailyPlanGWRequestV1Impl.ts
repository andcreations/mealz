import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateHydrationDailyPlanGWRequestV1,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

import { GWHydrationDailyPlanForCreationImpl } from '../types';

export class CreateHydrationDailyPlanGWRequestV1Impl
  implements CreateHydrationDailyPlanGWRequestV1
{
  @ApiProperty({
    description: 'Daily plan',
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => GWHydrationDailyPlanForCreationImpl)
  public hydrationDailyPlan: GWHydrationDailyPlanForCreationImpl;
}