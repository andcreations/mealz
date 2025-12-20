import { Module } from '@nestjs/common';
import { AdminNotificationsModule } from './services/notifications';

@Module({
  imports: [ AdminNotificationsModule ],
})
export class AdminDomainModule {}