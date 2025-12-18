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
import { getStrEnv, requireStrEnv } from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';
import { LocalEventTransporter } from '@mealz/backend-transport';
import { 
  SQLiteDBBackup,
  SQLiteDatabasesBackedUpEventV1, 
  SQLiteDBLocalEventTopics,
} from '@mealz/backend-db-api';

import { SQLiteDB } from '../db';

@Injectable()
export class SQLiteDBBackupService implements OnModuleInit {
  private static readonly DEFAULT_CRON_EXPRESSION = '0 2 * * *';
  private static readonly JOB_NAME = 'sqlite-db-backup';

  private readonly backupDir: string;
  private readonly dbs: SQLiteDB[] = [];

  public constructor(
    private readonly logger: Logger,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly localEventTransporter: LocalEventTransporter,
  ) {
    this.backupDir = this.resolveBackupDir();
    setTimeout(async () => {
      await this.backup();
    }, 1001)
  }

  private resolveBackupDir(): string {
    return path.resolve(requireStrEnv('MEALZ_SQLITE_DB_BACKUP_DIR'));
  }

  public onModuleInit(): void {
    // directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    this.logger.debug('SQLiteDB backup directory', {
      ...BOOTSTRAP_CONTEXT,
      backupDir: this.backupDir,
    });

    // job
    const cronExpression = getStrEnv(
      'MEALZ_SQLITE_DB_BACKUP_CRON_EXPRESSION',
      SQLiteDBBackupService.DEFAULT_CRON_EXPRESSION,
    );
    const job = new CronJob(cronExpression, () => {
      this.backup();
    });

    this.logger.info('Scheduling SQLite database backup', {
      ...BOOTSTRAP_CONTEXT,
      cronExpression,
    });
    // schedule the job
    this.schedulerRegistry.addCronJob(SQLiteDBBackupService.JOB_NAME, job);
    job.start();
  }

  public register(db: SQLiteDB): void {
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
      backupDir: this.backupDir,
      successfulBackups: [],
      failedBackups: [],
    };
    
    // backup each database
    for (const db of this.dbs) {
      const backup: SQLiteDBBackup = {
        filename: db.getDbFilename(),
      };
      try {
        await this.backupDB(db, context);
        event.successfulBackups.push(backup);
      } catch (error) {
        this.logger.error(
          'Failed to backup SQLite database', {
            ...context,
            dbFilename: db.getDbFilename(),
          },
          error,
        );
        event.failedBackups.push(backup);
      }
    }

    // emit event
    this.localEventTransporter.emitEvent(
      SQLiteDBLocalEventTopics.DatabasesBackedUpV1,
      event,
      context,
    );
  }

  private async backupDB(db: SQLiteDB, context: Context): Promise<void> {
    const dbFilename = path.basename(db.getDbFilename());
    const dbBackupFilename = path.resolve(
      path.join(this.backupDir, `${dbFilename}`),
    );
    this.logger.debug('Backing up SQLite database', {
      ...context,
      dbFilename: db.getDbFilename(),
      dbBackupFilename,
    });

    // backup
    await db.backup(dbBackupFilename);

    this.logger.debug('SQLite database backed up', {
      ...context,
      dbFilename: db.getDbFilename(),
      dbBackupFilename,
    });
  }
}