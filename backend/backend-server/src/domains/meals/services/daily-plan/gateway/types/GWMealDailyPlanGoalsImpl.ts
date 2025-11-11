import { ApiProperty } from '@nestjs/swagger';
import { 
  IsCalories,
  IsCarbs,
  IsFat,
  IsProtein,
} from '@mealz/backend-gateway-common';
import {
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

export class GWMealDailyPlanGoalsImpl implements GWMealDailyPlanGoals {
  @ApiProperty({
    description: 'Calories goal in kcal',
  })
  @IsCalories()
  public calories: number;

  @ApiProperty({
    description: 'Protein goal in grams',
  })
  @IsProtein()
  public protein: number;

  @ApiProperty({
    description: 'Carbs goal in grams',
  })
  @IsCarbs()
  public carbs: number;

  @ApiProperty({
    description: 'Fat goal in grams',
  })
  @IsFat()
  public fat: number;
}