import { ApiProperty } from '@nestjs/swagger';
import { IsId, IsIntTimestamp } from '@mealz/backend-gateway-common';
import {
  GWHydrationLog,
} from '@mealz/backend-hydration-log-gateway-api';

export class GWHydrationLogImpl implements GWHydrationLog {
  @ApiProperty({
    description: 'Hydration log identifier',
  })
  @IsId()
  public id: string;


  @ApiProperty({
    description: 'Timestamp (UTC) when the hydration log was created',
  })
  @IsIntTimestamp()
  public createdAt: number;
}