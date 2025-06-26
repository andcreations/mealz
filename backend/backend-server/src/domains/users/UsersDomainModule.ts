import { Module } from '@nestjs/common';
import { UsersAuthModule, UserAuthGWModule } from './services/auth';

@Module({
  imports: [   
    UsersAuthModule,
    UserAuthGWModule,
  ],
})
export class UsersDomainModule {}