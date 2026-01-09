import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsId, IsLimit } from '@mealz/backend-gateway-common';
import { 
  ReadNamedMealsFromLastQueryParamsV1,
} from '@mealz/backend-meals-named-gateway-api';

export class ReadNamedMealsFromLastQueryParamsV1Impl
  implements ReadNamedMealsFromLastQueryParamsV1
{
  @ApiProperty({
    description: 'Identifier of the last named meal read',
  })
  @IsOptional()
  @IsId()
  public lastId?: string;

  @ApiProperty({
    description: 'Number of named meals to read',
  })
  @IsOptional()
  @IsLimit()
  public limit?: number;
}