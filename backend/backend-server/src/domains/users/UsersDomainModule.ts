import { Module } from '@nestjs/common';

import { UsersAuthModule, UsersAuthGWModule } from './services/auth';
import { UsersCrudModule } from './services/crud';
import { UsersNotificationsModule } from './services/notifications';
import { UsersInsightsModule } from './services/insights';

@Module({
  imports: [   
    UsersAuthModule,
    UsersAuthGWModule,
    UsersCrudModule,
    UsersNotificationsModule,
    UsersInsightsModule,
  ],
})
export class UsersDomainModule {
}