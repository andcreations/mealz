import { Module } from '@nestjs/common';

import { UsersAuthModule, UsersAuthGWModule } from './services/auth';
import { UsersCrudModule } from './services/crud';
import { UsersNotificationsModule } from './services/notifications';

@Module({
  imports: [   
    UsersAuthModule,
    UsersAuthGWModule,
    UsersCrudModule,
    UsersNotificationsModule,
  ],
})
export class UsersDomainModule {
}