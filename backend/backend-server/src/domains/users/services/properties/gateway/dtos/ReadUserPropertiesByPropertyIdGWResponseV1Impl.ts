import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ReadUserPropertiesByPropertyIdGWResponseV1,
} from '@mealz/backend-users-properties-gateway-api';

import { GWUserPropertiesImpl } from '../types';

export class ReadUserPropertiesByPropertyIdGWResponseV1Impl
  implements ReadUserPropertiesByPropertyIdGWResponseV1
{
  @ApiPropertyOptional({
    description: 'User properties for the property',
    type: GWUserPropertiesImpl,
    required: false,
  })
  public userProperties?: GWUserPropertiesImpl;
}
