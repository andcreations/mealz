import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsId, IsLimit } from '@mealz/backend-gateway-common';
import { 
  ReadIngredientsFromLastQueryParamsV1,
} from '@mealz/backend-ingredients-crud-gateway-api';

export class ReadIngredientsFromLastGWQueryParamsV1Impl
  implements ReadIngredientsFromLastQueryParamsV1
{
  @ApiProperty({
    description: 'Last ingredient identifier',
    required: false,
  })
  @IsOptional()
  @IsId()
  public lastId?: string;

  @ApiProperty({
    description: 'Limit of ingredients to read',
    required: false,
  })
  @IsOptional()
  @IsLimit()
  public limit?: number;
}