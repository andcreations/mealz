import { ApiProperty } from '@nestjs/swagger';
import { IsName, IsCalories } from '@mealz/backend-gateway-common';
import { GWAdHocIngredient } from '@mealz/backend-meals-gateway-api';

export class GWAdHocIngredientImpl implements GWAdHocIngredient {
  @ApiProperty({
    description: 'Ingredient name'
  })
  @IsName()
  public name: string;

  @ApiProperty({
    description: 'Calories per 100 grams/milliliters'
  })
  @IsCalories()
  public caloriesPer100: number;  
}