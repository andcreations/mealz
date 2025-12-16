import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsId } from '@mealz/backend-gateway-common';
import { GWNamedMeal } from '@mealz/backend-meals-named-gateway-api';

export class GWNamedMealImpl implements GWNamedMeal {
  @ApiProperty({
    description: 'Named meal identifier',
  })
  @IsId()
  public id: string;

  @ApiProperty({
    description: 'Name of the named meal',
  })
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Meal identifier',
  })
  @IsId()
  public mealId: string;
}