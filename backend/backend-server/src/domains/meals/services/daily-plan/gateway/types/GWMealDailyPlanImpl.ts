import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsIntTimestamp } from '@mealz/backend-gateway-common';
import { GWMealDailyPlan } from '@mealz/backend-meals-daily-plan-gateway-api';

import { GWMealDailyPlanEntryImpl } from './GWMealDailyPlanEntryImpl';

export class GWMealDailyPlanImpl implements GWMealDailyPlan {
  @ApiProperty({
    description: 'Meal daily plan identifier',
  })
  @IsId()
  public id: string;

  @ApiProperty({
    description: 'Entries in the daily plan',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GWMealDailyPlanEntryImpl)
  public entries: GWMealDailyPlanEntryImpl[];

  @ApiProperty({
    description: 'Timestamp (UTC) when the daily plan was created',
  })
  @IsIntTimestamp()
  public createdAt: number;
}