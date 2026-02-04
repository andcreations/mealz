import { ApiProperty } from '@nestjs/swagger';
import { 
  GWIngredient,
  GWIngredientType,
  GWUnitPer100,
} from '@mealz/backend-ingredients-gateway-api';

import { GWFactPer100Impl } from './GWFactPer100Impl';
import { GWProductImpl } from './GWProductImpl';

export class GWIngredientImpl implements GWIngredient {
  @ApiProperty({
    description: 'Ingredient identifier'
  })
  public id: string;

  @ApiProperty({
    description: 'Ingredient name in various languages'
  })
  public name: Record<string, string>;

  @ApiProperty({
    description: 'Ingredient type'
  })
  public type: GWIngredientType;

  @ApiProperty({
    description: 'Ingredient unit per 100'
  })
  public unitPer100: GWUnitPer100;

  @ApiProperty({
    description: 'Ingredient facts per 100'
  })
  public factsPer100: GWFactPer100Impl[];

  @ApiProperty({
    description: 'Product if ingredient is a product'
  })
  public product?: GWProductImpl;
  
  @ApiProperty({
    description: 'Indicates if an ingredient is not visible to the user'
  })
  public isHidden?: boolean;
}