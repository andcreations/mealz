import { ApiProperty } from '@nestjs/swagger';
import { GWMealLog } from '@mealz/backend-meals-log-gateway-api';
import { GWMealWithoutIdImpl } from '@mealz/backend-meals-gateway-common';

export class GWMealLogImpl implements GWMealLog {
  @ApiProperty({
    description: 'Meal log identifier',
  })
  public id: string;

  @ApiProperty({
    description: 'User identifier',
  })
  public userId: string;

  @ApiProperty({
    description: 'Meal identifier',
  })
  public mealId: string;

  @ApiProperty({
    description: 'Daily plan meal name',
  })
  public dailyPlanMealName?: string;

  @ApiProperty({
    description: 'Timestamp when the meal was logged',
  })
  public loggedAt: number;

  @ApiProperty({
    description: 'Meal',
  })
  public meal: GWMealWithoutIdImpl;
}