
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { FactPer100V1 } from './FactPer100V1';
import { ProductV1 } from './ProductV1';

export enum IngredientTypeV1 {
  Generic = 0,
  Product = 1,
}

export enum UnitPer100V1 {
  Grams = 0,
  Milliliters = 1,
}

export class IngredientDetailsV1 {
  // Name in various languages
  @IsString({ each: true })
  @Transform(({ value }) => new Map(Object.entries(value)))
  public name: Record<string, string>;

  // Type of ingredient
  @IsEnum(IngredientTypeV1)
  public type: IngredientTypeV1;

  // Unit of measure for facts per 100g
  @IsEnum(UnitPer100V1)
  public unitPer100: UnitPer100V1;

  // Facts per 100g
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FactPer100V1)
  public factsPer100: FactPer100V1[];

  // Product if ingredient is a product
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductV1)
  public product?: ProductV1;
}