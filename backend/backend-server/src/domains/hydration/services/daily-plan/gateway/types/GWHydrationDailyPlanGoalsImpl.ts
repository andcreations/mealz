import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import {
  GWHydrationDailyPlanGoals,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

export class GWHydrationDailyPlanGoalsImpl
  implements GWHydrationDailyPlanGoals
{
  @ApiProperty({
    description: 'Number of glasses goal',
  })
  @IsNumber()
  public glasses: number;
}