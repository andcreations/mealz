import * as path from 'path';
import * as fs from 'fs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import {
  BOOTSTRAP_CONTEXT,
  Context,
  generateCorrelationId,
} from '@mealz/backend-core';
import {
  createTranslation,
  deleteFilesInDirectory,
  getStrEnv,
  requireStrEnv,
  resolveTimeZone,
  TranslateFunc,
} from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';
import { LocalEventTransporter } from '@mealz/backend-transport';
import { BackupJobRunner } from '@mealz/backend-backup';
import { 
  SQLiteDBBackup,
  SQLiteDatabasesBackedUpEventV1, 
  SQLiteDBLocalEventTopics,
} from '@mealz/backend-db-api';
import { 
  AdminNotificationsTransporter,
  AdminNotificationType,
} from '@mealz/backend-admin-notifications-service-api';

import { SQLITE_DUMP_DIR_ENV_NAME } from '../const';
import { SQLiteDB } from '../db';
import { SQLiteDBBackupServiceTranslations } from './SQLiteDBBackupService.translations';

@Injectable()
export class SQLiteDBBackupService implements OnModuleInit {
  private static readonly DEFAULT_CRON = '0 2 * * *';
  private static readonly JOB_NAME = 'sqlite-db-backup';

  private readonly dumpDir: string;
  private readonly dbs: SQLiteDB[] = [];
  private readonly translate: TranslateFunc;

  public constructor(
    private readonly logger: Logger,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly localEventTransporter: LocalEventTransporter,
    private readonly backupJobRunner: BackupJobRunner,
    private readonly adminNotificationsTransporter: AdminNotificationsTransporter,
  ) {
    this.dumpDir = this.resolveBackupDir();
    this.translate = createTranslation(SQLiteDBBackupServiceTranslations);
  }

  private resolveBackupDir(): string {
    return path.resolve(requireStrEnv(SQLITE_DUMP_DIR_ENV_NAME));
  }

  public async onModuleInit(): Promise<void> {
    // directory
    if (!fs.existsSync(this.dumpDir)) {
      fs.mkdirSync(this.dumpDir, { recursive: true });
    }
    this.logger.debug('SQLiteDB dump directory', {
      ...BOOTSTRAP_CONTEXT,
      dumpDir: this.dumpDir,
    });

    // create job
    const cronExpression = getStrEnv(
      'MEALZ_SQLITE_DB_BACKUP_CRON',
      SQLiteDBBackupService.DEFAULT_CRON,
    );
    const job = new CronJob(
      cronExpression,
      () => { this.backup(); },
      undefined,
      undefined,
      resolveTimeZone(),
    );

    // schedule the job
    this.logger.info('Scheduling SQLite database backup', {
      ...BOOTSTRAP_CONTEXT,
      cronExpression,
    });
    this.schedulerRegistry.addCronJob(SQLiteDBBackupService.JOB_NAME, job);
    job.start();
  }

  public register(db: SQLiteDB): void {
    // happens when there are two or more SQLiteDB instances of the same database
    const has = this.dbs.some(d => d.getDbFilename() === db.getDbFilename());
    if (has) {
      return;
    }

    this.logger.debug('Registering SQLite backup', {
      ...BOOTSTRAP_CONTEXT,
      dbFilename: db.getDbFilename(),
    });
    this.dbs.push(db);
  }

  private async backup(): Promise<void> {
    const context: Context = {
      correlationId: generateCorrelationId(SQLiteDBBackupService.JOB_NAME),
    }
    const event: SQLiteDatabasesBackedUpEventV1 = {
      backupDir: this.dumpDir,
      successfulBackups: [],
      failedBackups: [],
    };
    const allBackups: SQLiteDBBackup[] = [];

    // wipe the backup directory
    deleteFilesInDirectory(this.dumpDir);
    
    // dump each database
    for (const db of this.dbs) {
      const backup: SQLiteDBBackup = {
        filename: path.basename(db.getDbFilename()),
      };
      allBackups.push(backup);

      try {
        await this.dumpDB(db);
        event.successfulBackups.push(backup);
      } catch (error) {
        this.logger.error(
          'Failed to dump SQLite database', {
            ...context,
            dbFilename: db.getDbFilename(),
          },
          error,
        );
        event.failedBackups.push(backup);
      }
    }

    // backup the databases
    try {
      await this.backupJobRunner.runAll(context);
    } catch (error) {
      this.logger.error('Failed to backup databases', context, error);

      // consider all failed if the backup fails
      event.successfulBackups = [];
      event.failedBackups = allBackups;
    }

    // log
    if (event.failedBackups.length === 0) {
      this.logger.info('Successfully backed up SQLite databases', {
        ...context,
        backups: event.successfulBackups.map(backup => {
          return backup.filename;
        }),
      });
    }
    else {
      this.logger.error('Failed to backup SQLite databases', {
        ...context,
        successfulBackups: event.successfulBackups.map(backup => {
          return backup.filename;
        }),
        failedBackups: event.failedBackups.map(backup => {
          return backup.filename;
        }),
      });
      await this.adminNotificationsTransporter.sendAdminNotificationV1(
        {
          notification: {
            type: AdminNotificationType.Error,
            message: this.translate('failed-to-backup-sqlite-databases'),
          },
        },
        context,
      );
    }

    // emit event
    this.localEventTransporter.emitEvent(
      SQLiteDBLocalEventTopics.DatabasesBackedUpV1,
      event,
      context,
    );
  }

  private async dumpDB(db: SQLiteDB): Promise<void> {
    const dbFilename = path.basename(db.getDbFilename());
    const dbBackupFilename = path.resolve(
      path.join(this.dumpDir, `${dbFilename}`),
    );
    await db.backup(dbBackupFilename);
  }
}