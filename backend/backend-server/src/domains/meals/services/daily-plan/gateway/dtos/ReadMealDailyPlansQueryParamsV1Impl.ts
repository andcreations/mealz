import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsLimit } from '@mealz/backend-gateway-common';
import {
  ReadMealDailyPlansQueryParamsV1,
} from '@mealz/backend-meals-daily-plan-gateway-api';

export class ReadMealDailyPlansQueryParamsV1Impl
  implements ReadMealDailyPlansQueryParamsV1
{
  @ApiProperty({
    description: 'Number of daily plans to read',
  })
  @IsOptional()
  @IsLimit()
  public limit?: number;
}