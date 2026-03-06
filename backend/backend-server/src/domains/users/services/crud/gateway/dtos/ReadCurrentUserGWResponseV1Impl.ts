import { ReadCurrentUserGWResponseV1 } from '@mealz/backend-users-crud-gateway-api';
import { ApiProperty } from '@nestjs/swagger';
import { GWUserInfoImpl } from '../types/GWUserInfoImpl';

export class ReadCurrentUserGWResponseV1Impl
  implements ReadCurrentUserGWResponseV1
{
  @ApiProperty({
    description: 'The user info',
  })
  public userInfo: GWUserInfoImpl;
}