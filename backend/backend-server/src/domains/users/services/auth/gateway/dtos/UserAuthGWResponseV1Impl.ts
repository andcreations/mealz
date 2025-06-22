import { UserAuthGWResponseV1 } from '#mealz/backend-users-auth-gateway-api';
import { ApiProperty } from '@nestjs/swagger';

export class UserAuthGWResponseV1Impl implements UserAuthGWResponseV1 {
  @ApiProperty({
    description: 'Access token',
  })
  public accessToken: string;
}