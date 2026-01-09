import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { IsId, IsIntTimestamp } from '@mealz/backend-gateway-common';
import {
  GW_GLASS_FRACTIONS,
  GWGlassFraction,
  GWHydrationLog,
} from '@mealz/backend-hydration-log-gateway-api';

export class GWHydrationLogImpl implements GWHydrationLog {
  @ApiProperty({
    description: 'Hydration log identifier',
  })
  @IsId()
  public id: string;

  @ApiProperty({
    description: 'User identifier',
  })
  @IsId()
  public userId: string;

  @ApiProperty({
    description: 'Glass fraction',
  })
  @IsIn(GW_GLASS_FRACTIONS)
  public glassFraction: GWGlassFraction;

  @ApiProperty({
    description: 'Timestamp (UTC) when the hydration log was created',
  })
  @IsIntTimestamp()
  public loggedAt: number;
}