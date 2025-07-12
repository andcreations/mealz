import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserAuthGWRequestV1 } from '@mealz/backend-users-auth-gateway-api';

export class UserAuthGWRequestV1Impl implements UserAuthGWRequestV1 {
  @ApiProperty({
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  public password: string;
}