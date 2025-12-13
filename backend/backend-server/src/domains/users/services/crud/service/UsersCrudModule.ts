import { Module } from '@nestjs/common';
import { SQLiteDBModule } from '@mealz/backend-db';
import {
  USERS_SQLITE_DB_MODULE_OPTIONS,
  UserDBMapper,
} from '@mealz/backend-users-db';

import { UsersCrudRepository } from './repositories';
import { UsersCrudService } from './services';
import { UsersCrudRequestController } from './controllers';

@Module({
  imports: [
    SQLiteDBModule.forRoot(USERS_SQLITE_DB_MODULE_OPTIONS),
  ],
  providers: [
    UserDBMapper,
    UsersCrudRepository,
    UsersCrudService,
    UsersCrudRequestController,
  ],
})
export class UsersCrudModule {
}