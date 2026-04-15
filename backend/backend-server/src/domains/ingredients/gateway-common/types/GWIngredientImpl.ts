import { ApiProperty } from '@nestjs/swagger';
import { 
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IsId, IsNameRecord } from '@mealz/backend-gateway-common';
import { 
  GWIngredient,
  GWIngredientType,
  GWUnitPer100,
} from '@mealz/backend-ingredients-gateway-api';

import { GWFactPer100Impl } from './GWFactPer100Impl';
import { GWProductImpl } from './GWProductImpl';
import { Type } from 'class-transformer';

export class GWIngredientImpl implements GWIngredient {
  @ApiProperty({
    description: 'Ingredient identifier'
  })
  @IsId()
  public id: string;

  @ApiProperty({
    description: 'Ingredient name in various languages'
  })
  @IsNameRecord()
  public name: Record<string, string>;

  @ApiProperty({
    description: 'Ingredient type'
  })
  @IsEnum(GWIngredientType)
  public type: GWIngredientType;

  @ApiProperty({
    description: 'Ingredient unit per 100'
  })
  @IsEnum(GWUnitPer100)
  public unitPer100: GWUnitPer100;

  @ApiProperty({
    description: 'Ingredient facts per 100'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GWFactPer100Impl)
  public factsPer100: GWFactPer100Impl[];

  @ApiProperty({
    description: 'Product if ingredient is a product'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GWProductImpl)
  public product?: GWProductImpl;
  
  @ApiProperty({
    description: 'Indicates if an ingredient is not visible to the user'
  })
  @IsOptional()
  @IsBoolean()
  public isHidden?: boolean;
}