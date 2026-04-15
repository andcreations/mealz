import { Module } from '@nestjs/common';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';
import { SocketAPIModule } from '@mealz/backend-socket-api';

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
  HydrationLogEventService, 
  HydrationLogHistoryService,
} from './services';
import { 
  HydrationLogEventController,
  HydrationLogRequestController,
} from './controllers';

@Module({
  imports: [
    SQLiteDBModule.forFeature(HYDRATION_LOG_SQLITE_DB_MODULE_OPTIONS),
    SocketAPIModule.forRoot({}),
    HydrationLogDBModule,
  ],
  providers: [
    IdGeneratorProvider,
    HydrationLogCrudService,
    HydrationLogCrudRepository,
    HydrationLogHistoryRepository,
    HydrationLogHistoryService,
    HydrationLogEventService,
    HydrationLogRequestController,
    HydrationLogEventController,
  ],
})
export class HydrationLogModule {}