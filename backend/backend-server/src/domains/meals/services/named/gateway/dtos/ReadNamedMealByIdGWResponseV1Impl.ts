import { ReadNamedMealByIdGWResponseV1 } from '@mealz/backend-meals-named-gateway-api';
import { ApiProperty } from '@nestjs/swagger';
import { GWNamedMealImpl } from '../types';
import { GWMealImpl } from '@mealz/backend-meals-gateway-common';

export class ReadNamedMealByIdGWResponseV1Impl
  implements ReadNamedMealByIdGWResponseV1
{
  @ApiProperty({
    description: 'Named meal',
  })
  public namedMeal: GWNamedMealImpl;

  @ApiProperty({
    description: 'Meal',
  })
  public meal: GWMealImpl;
}