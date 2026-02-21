import { ApiProperty } from '@nestjs/swagger';
import {
  GWUserProperties,
} from '@mealz/backend-users-properties-gateway-api';

export class GWUserPropertiesImpl implements GWUserProperties {
  @ApiProperty({ description: 'User properties id' })
  public id: string;

  @ApiProperty({ description: 'User id' })
  public userId: string;

  @ApiProperty({ description: 'Property id' })
  public propertyId: string;

  @ApiProperty({ description: 'Properties data' })
  public data: unknown;

  @ApiProperty({ description: 'Last modified timestamp' })
  public modifiedAt: number;
}
