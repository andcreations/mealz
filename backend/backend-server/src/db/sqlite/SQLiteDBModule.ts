import * as fs from 'fs';
import * as path from 'path';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';
import { InternalError } from '@mealz/backend-common';
import { getLogger, Logger, LoggerModule } from '@mealz/backend-logger';

import { getDBRepositoryToken } from '../core';
import { 
  SQLiteSQLBuilder,
  SQLiteDBRepositoryFactory, 
  SQLiteDB, 
} from './services';

interface Entity {
  entityName: string;
  tableName: string;
}

export interface SQLiteDBModuleOptions {
  name: string;
  dbFilename: string;
  entities: Array<Entity>;
}

@Module({})
export class SQLiteDBModule {
  public static forRoot(options: SQLiteDBModuleOptions): DynamicModule {
    const dbFilename = path.resolve(options.dbFilename);
    if (!fs.existsSync(dbFilename)) {
      throw new InternalError(
        `SQLite database file ${dbFilename} not found`,
      );
    }
    getLogger().info(`SQLite database module`, {
      ...BOOTSTRAP_CONTEXT,
      name: options.name,
      dbFilename,
      exists: fs.existsSync(dbFilename)
    });

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
      const token = getDBRepositoryToken(options.name, entity.entityName);
      getLogger().debug(`SQLite database repository`, {
        ...BOOTSTRAP_CONTEXT,
        dbFilename,
        entity: entity.entityName,
        tableName: entity.tableName,
        token,
      });
      return {
        provide: token,
        useFactory: async (factory: SQLiteDBRepositoryFactory) => {
          return factory.createRepository(entity.entityName, entity.tableName);
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
