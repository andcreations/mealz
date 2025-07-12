import {
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class YamlName {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  pl: string;
}

export class YamlFat {
  @IsNumber()
  total: number;

  @IsNumber()
  saturated: number;

  @IsNumber()
  monounsaturated: number;

  @IsNumber()
  polyunsaturated: number;
}

export class YamlFacts {
  @IsNumber()
  calories: number;

  @IsNumber()
  carbs: number;

  @IsNumber()
  sugars: number;

  @IsNumber()
  protein: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => YamlFat)
  fat: YamlFat;
}

export class YamlProduct {
  @IsString()
  @IsNotEmpty()
  brand: string;
}

// Represents an ingredient as it is stored in a YAML file.
export class YamlIngredient {
  @IsDefined()
  @ValidateNested()
  @Type(() => YamlName)
  name: YamlName;

  @IsIn(['g', 'ml'])
  unit: string;

  @IsIn(['generic', 'product'])
  type: 'generic' | 'product';

  @IsNumber()
  @Min(0.001)
  weight: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => YamlFacts)
  facts: YamlFacts;
  
  @IsOptional()
  @ValidateNested()
  @Type(() => YamlProduct)
  product?: YamlProduct;

  @IsUrl()
  link?: string;
}