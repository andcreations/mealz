import { ApiProperty } from '@nestjs/swagger';
import { OmitType, PartialType, PickType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { GWIngredientImpl } from '@mealz/backend-ingredients-gateway-common';
import {
  UpsertIngredientsGWRequestV1,
} from '@mealz/backend-ingredients-crud-gateway-api';

export class UpsertIngredientsGWRequestV1IngredientImpl
  extends IntersectionType(
    OmitType(GWIngredientImpl, ['id'] as const),
    PartialType(PickType(GWIngredientImpl, ['id'] as const)),
  ) {}

export class UpsertIngredientsGWRequestV1Impl
  implements UpsertIngredientsGWRequestV1
{
  @ApiProperty({
    description: 'Ingredients',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertIngredientsGWRequestV1IngredientImpl)
  public ingredients: UpsertIngredientsGWRequestV1IngredientImpl[];
}