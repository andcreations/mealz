import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { CreateUserGWRequestV1 } from '@mealz/backend-users-crud-gateway-api';

export class CreateUserGWRequestV1Impl implements CreateUserGWRequestV1 {
  @ApiProperty({
    description: 'The first name of the user',
  })
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
  })
  @IsString()
  @IsNotEmpty()
  public lastName: string;

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