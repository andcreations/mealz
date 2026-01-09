import { ApiProperty } from '@nestjs/swagger';
import { IsHour, IsMinute } from '@mealz/backend-gateway-common';
import { GWHydrationDailyPlanReminderEntry } from '@mealz/backend-hydration-daily-plan-gateway-api';
import { IsInt, IsNumber, Min } from 'class-validator';

export class GWHydrationDailyPlanReminderEntryImpl
  implements GWHydrationDailyPlanReminderEntry
{
  @ApiProperty({
    description: 'Start hour of the reminder',
  })
  @IsHour()
  public startHour: number;

  @ApiProperty({
    description: 'Start minute of the reminder',
  })
  @IsMinute()
  public startMinute: number;

  @ApiProperty({
    description: 'End hour of the reminder',
  })
  @IsHour()
  public endHour: number;

  @ApiProperty({
    description: 'End minute of the reminder',
  })
  @IsMinute()
  public endMinute: number;

  @ApiProperty({
    description: 'Number of minutes since last water intake that triggers the reminder',
  })
  @IsNumber()
  @IsInt()
  @Min(1)
  public minutesSinceLastWaterIntake: number;

  @ApiProperty({
    description: 'Period in minutes between reminders',
  })
  @IsNumber()
  @IsInt()
  @Min(1)
  public periodInMinutes: number;
}