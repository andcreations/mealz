import { Module } from '@nestjs/common';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';

import { 
  HYDRATION_LOG_SQLITE_DB_MODULE_OPTIONS, 
  HydrationLogDBModule,
} from './db';
import { 
  HydrationLogCrudRepository,
  HydrationLogHistoryRepository,
} from './repositories';
import { 
  HydrationLogCrudService, 
  HydrationLogHistoryService,
} from './services';
import { HydrationLogRequestController } from './controllers';

@Module({
  imports: [
    SQLiteDBModule.forFeature(HYDRATION_LOG_SQLITE_DB_MODULE_OPTIONS),
    HydrationLogDBModule,
  ],
  providers: [
    IdGeneratorProvider,
    HydrationLogCrudService,
    HydrationLogCrudRepository,
    HydrationLogHistoryRepository,
    HydrationLogHistoryService,
    HydrationLogRequestController,
  ],
})
export class HydrationLogModule {}