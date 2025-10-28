import { IsOptional } from 'class-validator';
import { IsId, IsLimit } from '@mealz/backend-gateway-common';

export class ReadIngredientsFromLastGWQueryParamsV1 {
  @IsOptional()
  @IsId()
  public lastId?: string;

  @IsOptional()
  @IsLimit()
  public limit?: number;
}