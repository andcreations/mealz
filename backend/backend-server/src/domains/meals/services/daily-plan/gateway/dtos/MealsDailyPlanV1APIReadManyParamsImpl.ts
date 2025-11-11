import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsLimit } from '@mealz/backend-gateway-common';
import {
  MealsDailyPlanV1APIReadManyParams,
} from '@mealz/backend-meals-daily-plan-gateway-api';

export class MealsDailyPlanV1APIReadManyParamsImpl
  implements MealsDailyPlanV1APIReadManyParams
{
  @ApiProperty({
    description: 'Number of daily plans to read',
  })
  @IsOptional()
  @IsLimit()
  public limit?: number;
}