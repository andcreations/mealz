import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsLimit } from '@mealz/backend-gateway-common';
import {
  HydrationDailyPlanV1APIReadManyParams,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

export class HydrationDailyPlanV1APIReadManyParamsImpl
  implements HydrationDailyPlanV1APIReadManyParams
{
  @ApiProperty({
    description: 'Number of daily plans to read',
  })
  @IsOptional()
  @IsLimit()
  public limit?: number;
}