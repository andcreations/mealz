import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  UpdateHydrationDailyPlanGWRequestV1,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

import { GWHydrationDailyPlanForUpdateImpl } from '../types';

export class UpdateHydrationDailyPlanGWRequestV1Impl
  implements UpdateHydrationDailyPlanGWRequestV1
{
  @ApiProperty({
    description: 'Hydration daily plan',
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => GWHydrationDailyPlanForUpdateImpl)
  public hydrationDailyPlan: GWHydrationDailyPlanForUpdateImpl;
}