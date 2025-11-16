import { 
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GWMealWithoutIdImpl } from '@mealz/backend-meals-gateway-common';
import { LogMealGWRequestV1 } from '@mealz/backend-meals-log-gateway-api';

export class LogMealGWRequestV1Impl implements LogMealGWRequestV1 {
  @ApiProperty({
    description: 'The meal to log'
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => GWMealWithoutIdImpl)
  public meal: GWMealWithoutIdImpl;

  @ApiProperty({
    description: 'The daily plan meal name'
  })
  @IsOptional()
  @IsString()
  public dailyPlanMealName?: string;
}