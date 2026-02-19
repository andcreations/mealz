import { ApiProperty } from '@nestjs/swagger';
import { GWTelegramUser } from '@mealz/backend-telegram-users-gateway-api';

export class GWTelegramUserImpl implements GWTelegramUser {
  @ApiProperty({
    description: 'Telegram username',
  })
  public telegramUsername: string;

  @ApiProperty({
    description: 'Indicates if Telegram is enabled for the user',
  })
  public isEnabled: boolean;
}