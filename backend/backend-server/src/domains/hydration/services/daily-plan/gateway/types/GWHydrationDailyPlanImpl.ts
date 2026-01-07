import { ApiProperty } from '@nestjs/swagger';
import { IsId, IsIntTimestamp } from '@mealz/backend-gateway-common';
import {
  GWHydrationDailyPlan,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

export class GWHydrationDailyPlanImpl implements GWHydrationDailyPlan {
  @ApiProperty({
    description: 'Hydration daily plan identifier',
  })
  @IsId()
  public id: string;


  @ApiProperty({
    description: 'Timestamp (UTC) when the hydration plan was created',
  })
  @IsIntTimestamp()
  public createdAt: number;
}