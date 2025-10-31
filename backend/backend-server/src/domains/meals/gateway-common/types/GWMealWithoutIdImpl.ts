import {
  IsArray,
  IsDefined,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCalories } from '@mealz/backend-gateway-common';
import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';

import { GWMealIngredientImpl } from './GWMealIngredientImpl';
import { Type } from 'class-transformer';

export class GWMealWithoutIdImpl implements GWMealWithoutId {
  @ApiProperty({
    description: 'Number of calories in the meal'
  })
  @IsOptional()
  @IsCalories()
  calories?: number;

  @ApiProperty({
    description: 'Meal ingredients'
  })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GWMealIngredientImpl)
  ingredients: GWMealIngredientImpl[];
}
