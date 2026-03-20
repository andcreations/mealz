import { Module } from '@nestjs/common';
import { EventLogAPIModule } from '@mealz/backend-event-log-service-api';

import { EventLogGWService } from './services';
import { EventLogGWController } from './controllers';

@Module({
  imports: [EventLogAPIModule.forRoot({})],
  providers: [EventLogGWService],
  controllers: [EventLogGWController],
})
export class EventLogGWModule {}
