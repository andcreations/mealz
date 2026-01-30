import { ApiProperty } from '@nestjs/swagger';
import { 
  GWPhotoScanMeal,
} from '@mealz/backend-meals-ai-scan-gateway-api';

import { GWPhotoScanIngredientImpl } from './GWPhotoScanIngredientImpl';

export class GWPhotoScanMealImpl implements GWPhotoScanMeal {
  @ApiProperty({
    description: 'Name of the meal',
  })
  public name: string;

  @ApiProperty({
    description: 'Calories of the meal',
  })
  public calories: number;

  @ApiProperty({
    description: 'Carbs of the meal',
  })
  public carbs: number;

  @ApiProperty({
    description: 'Protein of the meal',
  })
  public protein: number;

  @ApiProperty({
    description: 'Fat of the meal',
  })
  public fat: number;

  @ApiProperty({
    description: 'Ingredients of the meal',
  })
  public ingredients: GWPhotoScanIngredientImpl[];
}