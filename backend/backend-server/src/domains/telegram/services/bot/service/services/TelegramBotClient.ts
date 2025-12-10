import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '@mealz/backend-logger';
import { requireStrEnv } from '@mealz/backend-common';

@Injectable()
export class TelegramBotClient implements OnModuleInit {
  public constructor(private readonly logger: Logger) {}

  public async onModuleInit(): Promise<void> {
    const token = requireStrEnv('MEALZ_TELEGRAM_BOT_TOKEN');
  }
}