import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  CreateMealDailyPlanGWResponseV1,
} from '@mealz/backend-meals-daily-plan-gateway-api';

export class CreateMealDailyPlanGWResponseV1Impl
  implements CreateMealDailyPlanGWResponseV1
{
  @ApiProperty({
    description: 'Meal daily plan identifier',
  })
  @IsString()
  public id: string;
}