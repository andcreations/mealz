import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { 
  ChangePasswordGWRequestV1,
} from '@mealz/backend-users-auth-gateway-api';

export class ChangePasswordGWRequestV1Impl
  implements ChangePasswordGWRequestV1
{
  @ApiProperty({
    description: 'The old password of the user',
  })
  @IsString()
  @IsNotEmpty()
  public oldPassword: string;

  @ApiProperty({
    description: 'The new password of the user',
  })
  @IsString()
  @IsNotEmpty()
  public newPassword: string;
}