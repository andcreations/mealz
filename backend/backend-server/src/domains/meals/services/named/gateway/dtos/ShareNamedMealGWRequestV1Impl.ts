import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  ShareNamedMealGWRequestV1,
} from '@mealz/backend-meals-named-gateway-api';

export class ShareNamedMealGWRequestV1Impl
  implements ShareNamedMealGWRequestV1
{
  @ApiProperty({
    description: 'ID of the named meal to share',
  })
  @IsString()
  @IsNotEmpty()
  public namedMealId: string;

  @ApiProperty({
    description: 'ID of the user to share the named meal with',
  })
  @IsString()
  @IsNotEmpty()
  public sharedWithUserId: string;
}
