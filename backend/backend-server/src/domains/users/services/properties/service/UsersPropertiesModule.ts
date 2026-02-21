import { Module } from '@nestjs/common';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';

import { 
  USERS_PROPERTIES_SQLITE_DB_MODULE_OPTIONS,
  UsersPropertiesDBModule,
} from './db';
import { UsersPropertiesRequestController } from './controllers';
import { UsersPropertiesRepository } from './repositories';
import { UsersPropertiesService } from './services';

@Module({
  imports: [
    SQLiteDBModule.forFeature(USERS_PROPERTIES_SQLITE_DB_MODULE_OPTIONS),
    UsersPropertiesDBModule,
  ],
  providers: [
    IdGeneratorProvider,
    UsersPropertiesRepository,
    UsersPropertiesService,
    UsersPropertiesRequestController,
  ],
  exports: [
    UsersPropertiesService,
  ],
})
export class UsersPropertiesModule {}