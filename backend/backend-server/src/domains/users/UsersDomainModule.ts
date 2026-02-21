import { Module } from '@nestjs/common';

import { UsersAuthModule, UsersAuthGWModule } from './services/auth';
import { UsersCrudGWModule, UsersCrudModule } from './services/crud';
import { UsersNotificationsModule } from './services/notifications';
import { UsersInsightsModule } from './services/insights';
import { 
  UsersPropertiesGWModule,
  UsersPropertiesModule,
} from './services/properties';

@Module({
  imports: [   
    UsersAuthModule,
    UsersAuthGWModule,
    UsersCrudModule,
    UsersCrudGWModule,
    UsersNotificationsModule,
    UsersInsightsModule,
    UsersPropertiesModule,
    UsersPropertiesGWModule,
  ],
})
export class UsersDomainModule {}