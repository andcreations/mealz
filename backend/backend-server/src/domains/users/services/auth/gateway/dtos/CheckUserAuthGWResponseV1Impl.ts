import { ApiProperty } from '@nestjs/swagger';
import { CheckUserAuthGWResponseV1 } from '@mealz/backend-users-auth-gateway-api';

export class CheckUserAuthGWResponseV1Impl
  implements CheckUserAuthGWResponseV1
{
  @ApiProperty({
    description: 'User identifier',
  })
  public userId: string;
}