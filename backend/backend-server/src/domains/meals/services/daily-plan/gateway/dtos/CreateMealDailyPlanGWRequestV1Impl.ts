import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateMealDailyPlanGWRequestV1,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { GWMealDailyPlanForCreationImpl } from '../types';

export class CreateMealDailyPlanGWRequestV1Impl
  implements CreateMealDailyPlanGWRequestV1
{
  @ApiProperty({
    description: 'Daily plan',
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => GWMealDailyPlanForCreationImpl)
  public mealDailyPlan: GWMealDailyPlanForCreationImpl;
}