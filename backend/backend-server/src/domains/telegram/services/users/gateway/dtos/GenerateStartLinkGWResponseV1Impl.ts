import { ApiProperty } from '@nestjs/swagger';
import {
  GenerateStartLinkGWResponseV1,
} from '@mealz/backend-telegram-users-gateway-api';

export class GenerateStartLinkGWResponseV1Impl
  implements GenerateStartLinkGWResponseV1
{
  @ApiProperty({
    description: 'Start link',
  })
  public link: string;
}