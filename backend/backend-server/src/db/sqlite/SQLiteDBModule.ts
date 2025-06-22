import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Logger, LoggerModule } from '#mealz/backend-logger';

import { getDBRepositoryToken } from '../core';
import { 
  SQLiteSQLBuilder,
  SQLiteDBRepositoryFactory, 
  SQLiteDB, 
} from './services';

interface Entity {
  name: string;
}

export interface SQLiteDBModuleOptions {
  name: string;
  dbFilename: string;
  entities: Array<Entity>;
}

@Module({})
export class SQLiteDBModule {
  public static forRoot(options: SQLiteDBModuleOptions): DynamicModule {
    const sqlite: Provider = {
      provide: SQLiteDB,
      useFactory: async (logger: Logger): Promise<SQLiteDB> => {
        const db = new SQLiteDB(options, logger);
        await db.init();
        return db;
      },
      inject: [Logger],
    };
    const repositories: Provider[] = options.entities.map(entity => {
      return {
        provide: getDBRepositoryToken(options.name, entity.name),
        useFactory: async (factory: SQLiteDBRepositoryFactory) => {
          return factory.createRepository(entity.name);
        },
        inject: [SQLiteDBRepositoryFactory],
      };
    });

    return {
      module: SQLiteDBModule,
      imports: [
        LoggerModule,
      ],
      providers: [
        SQLiteDBRepositoryFactory,
        SQLiteSQLBuilder,
        sqlite,
        ...repositories,
      ],
      exports: [
        ...repositories,
      ],
    };
  }
}
