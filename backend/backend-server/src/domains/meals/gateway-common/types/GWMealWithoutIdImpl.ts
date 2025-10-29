import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCalories } from '@mealz/backend-gateway-common';
import { GWMeal } from '@mealz/backend-meals-gateway-api';

import { GWMealIngredientImpl } from './GWMealIngredientImpl';

export class GWMealWithoutIdImpl implements Omit<GWMeal, 'id'> {
  @ApiProperty({
    description: 'Number of calories in the meal'
  })
  @IsCalories()
  calories?: number;

  @ApiProperty({
    description: 'Meal ingredients'
  })
  ingredients: GWMealIngredientImpl[];
}
