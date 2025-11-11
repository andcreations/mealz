import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  UpdateMealDailyPlanGWRequestV1,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { GWMealDailyPlanForUpdateImpl } from '../types';

export class UpdateMealDailyPlanGWRequestV1Impl
  implements UpdateMealDailyPlanGWRequestV1
{
  @ApiProperty({
    description: 'Daily plan',
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => GWMealDailyPlanForUpdateImpl)
  public mealDailyPlan: GWMealDailyPlanForUpdateImpl;
}