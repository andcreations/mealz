import { Module } from '@nestjs/common';
import { IdGeneratorProvider } from '@mealz/backend-common';
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
    SQLiteDBModule.forFeature(USERS_SQLITE_DB_MODULE_OPTIONS),
  ],
  providers: [
    IdGeneratorProvider,
    UserDBMapper,
    UsersCrudRepository,
    UsersCrudService,
    UsersCrudRequestController,
  ],
})
export class UsersCrudModule {
}