import * as fs from 'fs';
import * as path from 'path';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';
import {
  getStrEnv,
  InternalError,
  requireStrEnv,
} from '@mealz/backend-common';
import { getLogger, Logger, LoggerModule } from '@mealz/backend-logger';
import { LocalEventTransporter } from '@mealz/backend-transport';
import {
  BackupJobDef,
  backupJobDef,
  BackupModule,
  CopyBackupJob,
} from '@mealz/backend-backup';

import { getDBRepositoryToken } from '../core';
import {
  SQLITE_DUMP_DIR_ENV_NAME,
  SQLITE_LOCAL_BACKUP_DIR_ENV_NAME,
} from './const';
import { 
  SQLiteSQLBuilder,
  SQLiteDBRepositoryFactory, 
  SQLiteDBBackupService, 
} from './services';

interface Entity {
  entityName: string;
  tableName: string;
}

export interface SQLiteDBModuleFeature {
  name: string;
  dbFilename: string;
  entities: Array<Entity>;
}

@Module({})
export class SQLiteDBModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: SQLiteDBModule,
      imports: [
        ScheduleModule.forRoot(),
        LoggerModule,
        BackupModule.forRoot({
          jobs: resolveBackupJobs(),
        }),
      ],
      providers: [
        LocalEventTransporter.provide(),
        SQLiteDBRepositoryFactory,
        SQLiteSQLBuilder,
        SQLiteDBBackupService,
      ],
      exports: [
        SQLiteDBRepositoryFactory,
        SQLiteSQLBuilder,
        SQLiteDBBackupService,
      ],
    };
  }

  public static forFeature(options: SQLiteDBModuleFeature): DynamicModule {
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
        useFactory: async (
          logger: Logger,
          sqliteSQLBuilder: SQLiteSQLBuilder,
          backupService: SQLiteDBBackupService,
          factory: SQLiteDBRepositoryFactory,
        ) => {
          return factory.createRepository(
            dbFilename,
            entity.entityName,
            entity.tableName,
            logger,
            sqliteSQLBuilder,
            backupService,
          );
        },
        inject: [
          Logger,
          SQLiteSQLBuilder,
          SQLiteDBBackupService,
          SQLiteDBRepositoryFactory,
        ],
      };
    });
    return {
      module: SQLiteDBModule,
      imports: [LoggerModule],
      providers: [...repositories],
      exports: [...repositories],
    };
  }
}

function resolveBackupJobs(): BackupJobDef<any>[] {
  const srcDir = requireStrEnv(SQLITE_DUMP_DIR_ENV_NAME);
  const jobDefs: BackupJobDef<any>[] = [];

  const envNames = Object.keys(process.env);
  for (const envName of envNames) {
    // local copy
    if (envName.startsWith(SQLITE_LOCAL_BACKUP_DIR_ENV_NAME)) {
      const dstDir = process.env[envName];
      getLogger().info('Adding SQLiteDB local backup', {
        ...BOOTSTRAP_CONTEXT,
        envName,
        dstDir,
      })
      jobDefs.push(backupJobDef(
        envName,
        CopyBackupJob,
        {
          srcDir,
          dstDir,
        }
      ));
    }
  }
  return jobDefs;
}