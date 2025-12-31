import { ApiProperty } from '@nestjs/swagger';
import {
  ReadMealLogsByDateRangeGWResponseV1,
} from '@mealz/backend-meals-log-gateway-api';

import { GWMealLogImpl } from '../types';

export class ReadMealLogsByDateRangeGWResponseV1Impl
  implements ReadMealLogsByDateRangeGWResponseV1
{
  @ApiProperty({
    description: 'Meal logs',
  })
  public mealLogs: GWMealLogImpl[];
}