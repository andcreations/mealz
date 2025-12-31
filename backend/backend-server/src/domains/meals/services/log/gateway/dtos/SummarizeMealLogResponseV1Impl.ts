import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GWMacrosImpl } from '@mealz/backend-meals-gateway-common';
import {
  SummarizeMealLogResponseV1,
} from '@mealz/backend-meals-log-service-api';

export class SummarizeMealLogResponseV1Impl implements SummarizeMealLogResponseV1 {
  @ApiProperty({
    description: 'Summary of the meal log',
  })
  @ValidateNested()
  @Type(() => GWMacrosImpl)
  public summary: GWMacrosImpl;
}