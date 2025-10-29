import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsId, IsAmount } from '@mealz/backend-gateway-common';
import { GWMealIngredient } from '@mealz/backend-meals-gateway-api';

import { GWAdHocIngredientImpl } from './GWAdHocIngredientImpl';

export class GWMealIngredientImpl implements GWMealIngredient {
  @ApiProperty({
    description: 'Identifier of a full ingredient'
  })
  @IsOptional()
  @IsId()
  public ingredientId?: string;

  @ApiProperty({
    description: 'Ad-hoc ingredient entered by the user'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GWAdHocIngredientImpl)
  public adHocIngredient?: GWAdHocIngredientImpl;

  @ApiProperty({
    description: 'Amount entered by the user'
  })
  @IsOptional()
  @IsAmount()
  public enteredAmount?: string;    
}