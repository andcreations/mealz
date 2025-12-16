import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  ReadNamedMealsFromLastGWResponseV1,
} from '@mealz/backend-meals-named-gateway-api';

import { GWNamedMealImpl } from '../types';

export class ReadNamedMealsFromLastGWResponseV1Impl
  implements ReadNamedMealsFromLastGWResponseV1
{
  @ApiProperty({
    description: 'Named meals',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GWNamedMealImpl)
  public namedMeals: GWNamedMealImpl[];
}