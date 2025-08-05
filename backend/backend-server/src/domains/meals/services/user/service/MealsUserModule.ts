import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';

import {
  MEALS_USER_SQLITE_DB_MODULE_OPTIONS,
  MealsUserDBModule,
} from './db';
import { MealsUserService } from './services';
import { MealsUserController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    SQLiteDBModule.forRoot(MEALS_USER_SQLITE_DB_MODULE_OPTIONS),
    MealsUserDBModule,    
  ],
  providers: [
    IdGeneratorProvider,
    MealsUserService,
    MealsUserController,
  ],
  exports: [
    MealsUserService,
  ],
})
export class MealsUserModule {
}
