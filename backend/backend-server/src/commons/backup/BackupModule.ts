import { DynamicModule, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Logger, LoggerModule } from '@mealz/backend-logger';

import { BackupModuleOptions } from './types';
import { BACKUP_JOB_PROVIDERS } from './jobs';
import { BackupJobRunner } from './services';

@Module({})
export class BackupModule {
  public static forRoot(options: BackupModuleOptions): DynamicModule {
    return {
      module: BackupModule,
      imports: [
        LoggerModule,
      ],
      providers: [
        ...BACKUP_JOB_PROVIDERS,
        {
          provide: BackupJobRunner,
          useFactory: (moduleRef: ModuleRef, logger: Logger) => {
            return new BackupJobRunner(moduleRef, logger, options.jobs);
          },
          inject: [ModuleRef, Logger],
        }
      ],
      exports: [
        BackupJobRunner,
      ],
    };
  }
}