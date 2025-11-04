import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  SummarizeMealLogResponseV1,
} from '@mealz/backend-meals-log-service-api';

import { GWMacrosSummaryImpl } from '../types';

export class SummarizeMealLogResponseV1Impl implements SummarizeMealLogResponseV1 {
  @ApiProperty({
    description: 'Summary of the meal log',
  })
  @ValidateNested()
  @Type(() => GWMacrosSummaryImpl)
  public summary: GWMacrosSummaryImpl;
}