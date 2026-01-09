import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsIn } from 'class-validator';
import {
  GlassFraction,
  GLASS_FRACTIONS,
} from '@mealz/backend-hydration-log-service-api';
import {
  LogHydrationGWRequestV1,
} from '@mealz/backend-hydration-log-gateway-api';

export class LogHydrationGWRequestV1Impl implements LogHydrationGWRequestV1 {
  @ApiProperty({
    description: 'The glass fraction',
  })
  @IsDefined()
  @IsIn(
    GLASS_FRACTIONS,
    {
      message: `Glass fraction must be one of ${GLASS_FRACTIONS.join(', ')}`,
    },
  )
  public glassFraction: GlassFraction;
}