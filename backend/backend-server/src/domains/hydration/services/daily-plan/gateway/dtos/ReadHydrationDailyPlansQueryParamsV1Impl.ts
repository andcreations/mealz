import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsLimit } from '@mealz/backend-gateway-common';
import {
  ReadHydrationDailyPlansQueryParamsV1,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

export class ReadHydrationDailyPlansQueryParamsV1Impl
  implements ReadHydrationDailyPlansQueryParamsV1
{
  @ApiProperty({
    description: 'Number of daily plans to read',
  })
  @IsOptional()
  @IsLimit()
  public limit?: number;
}