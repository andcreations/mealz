import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsId,
  IsLimit,
  arrayFromQueryParam,
} from '@mealz/backend-gateway-common';

export class ReadManyUserMealsGWQueryParamsV1 {
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
  public types?: string[];
}