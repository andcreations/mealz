import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { 
  IsName,
  IsCalories,
  IsCarbs,
  IsFat,
  IsProtein,
} from '@mealz/backend-gateway-common';
import { 
  GWAdHocIngredient,
} from '@mealz/backend-meals-gateway-api';

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

  @ApiPropertyOptional({
    description: 'Carbs per 100 grams/milliliters'
  })
  @IsOptional()
  @IsCarbs()
  public carbsPer100?: number;

  @ApiPropertyOptional({
    description: 'Fat per 100 grams/milliliters'
  })
  @IsOptional()
  @IsFat()
  public fatPer100?: number;

  @ApiPropertyOptional({
    description: 'Protein per 100 grams/milliliters'
  })
  @IsOptional()
  @IsProtein()
  public proteinPer100?: number;
}
