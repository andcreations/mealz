import { ApiProperty } from '@nestjs/swagger';
import { GWUserInfo } from '@mealz/backend-users-crud-gateway-api';

export class GWUserInfoImpl implements GWUserInfo {
  @ApiProperty({
    description: 'The first name of the user',
  })
  public firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
  })
  public lastName: string;

  @ApiProperty({
    description: 'The email of the user',
  })
  public email: string;
}