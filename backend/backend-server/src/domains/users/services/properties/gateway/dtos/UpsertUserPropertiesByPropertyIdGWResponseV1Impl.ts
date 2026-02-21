import { ApiProperty } from '@nestjs/swagger';
import {
  UpsertUserPropertiesByPropertyIdGWResponseV1,
} from '@mealz/backend-users-properties-gateway-api';

export class UpsertUserPropertiesByPropertyIdGWResponseV1Impl
  implements UpsertUserPropertiesByPropertyIdGWResponseV1
{
  @ApiProperty({
    description: 'User properties identifier',
  })
  public id: string;
}
