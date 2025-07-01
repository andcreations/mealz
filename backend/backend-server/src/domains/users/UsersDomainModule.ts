import { Module } from '@nestjs/common';
import { UsersAuthModule, UsersAuthGWModule } from './services/auth';

@Module({
  imports: [   
    UsersAuthModule,
    UsersAuthGWModule,
  ],
})
export class UsersDomainModule {
}