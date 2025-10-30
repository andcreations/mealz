import { Module } from '@nestjs/common';
import { SQLiteDBModule } from '@mealz/backend-db';
import {
  USERS_SQLITE_DB_MODULE_OPTIONS,
  UserDBMapper,
} from '@mealz/backend-users-db';

import { UsersAuthRepository } from './repositories';
import { UsersAuthService } from './services';
import { UsersAuthRequestController } from './controllers';

@Module({
  imports: [
    SQLiteDBModule.forRoot(USERS_SQLITE_DB_MODULE_OPTIONS),
  ],
  providers: [
    UserDBMapper,
    UsersAuthRepository,
    UsersAuthService,
    UsersAuthRequestController,
  ],
})
export class UsersAuthModule {
}