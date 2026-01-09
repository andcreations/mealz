import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsId,
  IsLimit,
  arrayFromQueryParam,
} from '@mealz/backend-gateway-common';
import {
  ReadManyUserMealsQueryParamsV1,
} from '@mealz/backend-meals-user-gateway-api';

export class ReadManyUserMealsQueryParamsV1Impl
  implements ReadManyUserMealsQueryParamsV1
{
  @ApiProperty({
    description: 'Identifier of the last user meal read',
  })
  @IsOptional()
  @IsId()
  public lastId?: string;

  @ApiProperty({
    description: 'Number of user meals to read',
  })
  @IsOptional()
  @IsLimit()
  public limit: number;

  @ApiProperty({
    description: 'Types of user meals to read',
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => arrayFromQueryParam(value))
  public typeIds?: string[];
}