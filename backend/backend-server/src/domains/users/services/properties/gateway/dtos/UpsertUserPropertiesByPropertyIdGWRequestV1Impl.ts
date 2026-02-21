import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsObject, IsOptional, IsString } from 'class-validator';
import {
  UpsertUserPropertiesByPropertyIdGWRequestV1,
} from '@mealz/backend-users-properties-gateway-api';

export class UpsertUserPropertiesByPropertyIdGWRequestV1Impl
  implements UpsertUserPropertiesByPropertyIdGWRequestV1
{
  @ApiPropertyOptional({
    description: 'User properties identifier if updating',
    required: false,
  })
  @IsOptional()
  @IsString()
  public id?: string;

  @ApiProperty({
    description: 'Properties data',
  })
  @IsDefined()
  @IsObject()
  public data: unknown;
}
