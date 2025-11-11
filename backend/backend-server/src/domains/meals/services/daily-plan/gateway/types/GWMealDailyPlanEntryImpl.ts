import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsHour, IsMinute } from '@mealz/backend-gateway-common';
import { 
  GWMealDailyPlanEntry,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { GWMealDailyPlanGoalsImpl } from './GWMealDailyPlanGoalsImpl';

export class GWMealDailyPlanEntryImpl implements GWMealDailyPlanEntry {
  @ApiProperty({
    description: 'Start hour of the meal',
  })
  @IsHour()
  public startHour: number;

  @ApiProperty({
    description: 'Start minute of the meal',
  })
  @IsMinute()
  public startMinute: number;

  @ApiProperty({
    description: 'End hour of the meal',
  })
  @IsHour()
  public endHour: number;

  @ApiProperty({
    description: 'End minute of the meal',
  })
  @IsMinute()
  public endMinute: number;

  @ApiProperty({
    description: 'Name of the meal',
  })
  @IsString()
  @IsNotEmpty()
  public mealName: string;

  @ApiProperty({
    description: 'Goals for the meal',
  })
  @ValidateNested()
  @Type(() => GWMealDailyPlanGoalsImpl)
  public goals: GWMealDailyPlanGoalsImpl;
}