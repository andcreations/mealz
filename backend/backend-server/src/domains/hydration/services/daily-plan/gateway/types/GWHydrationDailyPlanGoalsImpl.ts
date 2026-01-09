import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';
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
  @IsInt()
  @Min(1)
  public glasses: number;
}