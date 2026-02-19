import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import {
  PatchTelegramUserGWRequestV1,
} from '@mealz/backend-telegram-users-gateway-api';

export class PatchTelegramUserGWRequestV1Impl
  implements PatchTelegramUserGWRequestV1
{
  @ApiProperty({
    description: 'Indicates if Telegram is enabled for the user',
  })
  @IsOptional()
  @IsBoolean()
  public isEnabled?: boolean;
}