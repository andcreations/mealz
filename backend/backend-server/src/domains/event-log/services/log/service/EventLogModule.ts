import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';

import { EventLogService } from './services';
import { EventLogRequestController } from './controllers';

@Module({
  imports: [
    LoggerModule,
  ],
  providers: [
    EventLogService,
    EventLogRequestController,
  ],
})
export class EventLogModule {}
