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
    description: 'Calories from goal in kcal',
  })
  @IsCalories()
  public caloriesFrom: number;

  @ApiProperty({
    description: 'Calories to goal in kcal',
  })
  @IsCalories()
  public caloriesTo: number;

  @ApiProperty({
    description: 'Protein from goal in grams',
  })
  @IsProtein()
  public proteinFrom: number;


  @ApiProperty({
    description: 'Protein to goal in grams',
  })
  @IsProtein()
  public proteinTo: number;

  @ApiProperty({
    description: 'Carbs from goal in grams',
  })
  @IsCarbs()
  public carbsFrom: number;


  @ApiProperty({
    description: 'Carbs to goal in grams',
  })
  @IsCarbs()
  public carbsTo: number;

  @ApiProperty({
    description: 'Fat from goal in grams',
  })
  @IsFat()
  public fatFrom: number;

  @ApiProperty({
    description: 'Fat to goal in grams',
  })
  @IsFat()
  public fatTo: number;
}