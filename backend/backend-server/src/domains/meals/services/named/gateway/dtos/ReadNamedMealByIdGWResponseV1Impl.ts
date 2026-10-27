import { ReadNamedMealByIdGWResponseV1 } from '@mealz/backend-meals-named-gateway-api';
import { ApiProperty } from '@nestjs/swagger';
import { GWUpdatedAtImpl } from '@mealz/backend-gateway-common';
import { GWMealImpl } from '@mealz/backend-meals-gateway-common';

import { GWNamedMealImpl } from '../types';

export class ReadNamedMealByIdGWResponseV1Impl
  implements ReadNamedMealByIdGWResponseV1
{
  @ApiProperty({
    description: 'Named meal',
  })
  public namedMeal: GWNamedMealImpl & GWUpdatedAtImpl;

  @ApiProperty({
    description: 'Meal',
  })
  public meal: GWMealImpl;
}