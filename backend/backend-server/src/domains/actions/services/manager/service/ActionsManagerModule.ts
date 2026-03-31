import { Module } from '@nestjs/common';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { LoggerModule } from '@mealz/backend-logger';
import { SQLiteDBModule } from '@mealz/backend-db';

import { 
  ACTIONS_MANAGER_SQLITE_DB_MODULE_OPTIONS,
  ActionsManagerDBModule,
} from './db';
import { ActionCrudRepository } from './repositories';
import { ActionsManagerService } from './services';
import { ActionsManagerRequestController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    SQLiteDBModule.forFeature(ACTIONS_MANAGER_SQLITE_DB_MODULE_OPTIONS),
    ActionsManagerDBModule,
  ],
  providers: [
    IdGeneratorProvider,
    ActionCrudRepository,
    ActionsManagerService,
    ActionsManagerRequestController,
  ],
})
export class ActionsManagerModule {}