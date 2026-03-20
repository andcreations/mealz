import { Module } from '@nestjs/common';
import { EventLogGWModule, EventLogModule } from './services/log';

@Module({
  imports: [
    EventLogModule,
    EventLogGWModule,
  ],
})
export class EventLogDomainModule {}