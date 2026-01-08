import { Module } from '@nestjs/common';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';

import { 
  HYDRATION_LOG_SQLITE_DB_MODULE_OPTIONS, 
  HydrationLogDBModule,
} from './db';
import { HydrationLogCrudRepository } from './repositories';
import { HydrationLogCrudService } from './services';
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
    HydrationLogRequestController,
  ],
})
export class HydrationLogModule {}