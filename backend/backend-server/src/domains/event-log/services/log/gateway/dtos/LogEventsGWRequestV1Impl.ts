import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  LogEventsGWRequestV1,
} from '@mealz/backend-event-log-gateway-api';

import { GWEventLogImpl } from '../types/GWEventLogImpl';

export class LogEventsGWRequestV1Impl implements LogEventsGWRequestV1 {
  @ApiProperty({
    description: 'The event to log',
  })
  @ValidateNested({ each: true })
  @IsDefined({ each: true })
  @Type(() => GWEventLogImpl)
  @IsArray()
  public events: GWEventLogImpl[];
}
