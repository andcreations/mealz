import { Module } from '@nestjs/common';
import { SQLiteDBModule } from '#mealz/backend-db';
import { USERS_SQLITE_DB_MODULE_OPTIONS } from '#mealz/backend-users-db';

import { UsersAuthRepository } from './repositories';
import { UsersAuthService } from './services';
import { UsersAuthTransportController } from './controllers';

@Module({
  imports: [
    SQLiteDBModule.forRoot(USERS_SQLITE_DB_MODULE_OPTIONS),
  ],
  providers: [
    UsersAuthRepository,
    UsersAuthService,
    UsersAuthTransportController,
  ],
})
export class UsersAuthModule {}