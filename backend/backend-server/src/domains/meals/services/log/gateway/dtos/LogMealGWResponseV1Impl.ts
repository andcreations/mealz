import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  LogMealGWResponseStatusV1,
  LogMealGWResponseV1,
} from '@mealz/backend-meals-log-gateway-api';

export class LogMealGWResponseV1Impl implements LogMealGWResponseV1 {
  @ApiProperty({
    description: 'Meal log identifier'
  })
  @IsString()
  public id: string;

  @ApiProperty({
    description: 'Meal log status'
  })
  public status: LogMealGWResponseStatusV1;
}