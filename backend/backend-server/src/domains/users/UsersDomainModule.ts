import { Module } from '@nestjs/common';

import { UsersAuthModule, UsersAuthGWModule } from './services/auth';
import { UsersCrudModule } from './services/crud';

@Module({
  imports: [   
    UsersAuthModule,
    UsersAuthGWModule,
    UsersCrudModule,
  ],
})
export class UsersDomainModule {
}