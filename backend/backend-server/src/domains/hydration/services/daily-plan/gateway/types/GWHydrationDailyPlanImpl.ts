import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsIntTimestamp } from '@mealz/backend-gateway-common';
import {
  GWHydrationDailyPlan,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

import {
  GWHydrationDailyPlanGoalsImpl,
} from './GWHydrationDailyPlanGoalsImpl';
import {
  GWHydrationDailyPlanRemindersImpl,
} from './GWHydrationDailyPlanRemindersImpl';

export class GWHydrationDailyPlanImpl implements GWHydrationDailyPlan {
  @ApiProperty({
    description: 'Hydration daily plan identifier',
  })
  @IsId()
  public id: string;

  @ApiProperty({
    description: 'Goals for the daily plan',
  })
  @ValidateNested()
  @Type(() => GWHydrationDailyPlanGoalsImpl)
  public goals: GWHydrationDailyPlanGoalsImpl;

  @ApiProperty({
    description: 'Reminders for the daily plan',
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => GWHydrationDailyPlanRemindersImpl)
  public reminders: GWHydrationDailyPlanRemindersImpl;

  @ApiProperty({
    description: 'Timestamp (UTC) when the hydration plan was created',
  })
  @IsIntTimestamp()
  public createdAt: number;
}