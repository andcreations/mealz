import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  GWHydrationDailyPlanReminders,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

import {
  GWHydrationDailyPlanReminderEntryImpl,
} from './GWHydrationDailyPlanReminderEntryImpl';

export class GWHydrationDailyPlanRemindersImpl
  implements GWHydrationDailyPlanReminders
{
  @ApiProperty({
    description: 'Whether reminders are enabled',
  })
  @IsBoolean()
  public enabled: boolean;

  @ApiProperty({
    description: 'Reminder entries',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GWHydrationDailyPlanReminderEntryImpl)
  public entries: GWHydrationDailyPlanReminderEntryImpl[];
}