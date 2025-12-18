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

import { SQLiteDB } from './SQLiteDB';

@Injectable()
export class SQLiteDBBackup implements OnModuleInit {
  private static readonly DEFAULT_CRON_EXPRESSION = '0 2 * * *';
  private static readonly JOB_NAME = 'sqlite-db-backup';

  private readonly backupDir: string;
  private readonly dbs: SQLiteDB[] = [];

  public constructor(
    private readonly logger: Logger,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.backupDir = this.resolveBackupDir();
  }

  private resolveBackupDir(): string {
    return path.resolve(requireStrEnv('MEALZ_SQLITE_DB_BACKUP_DIR'));
  }

  public onModuleInit(): void {
    // directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    // job
    const cronExpression = getStrEnv(
      'MEALZ_SQLITE_DB_BACKUP_CRON_EXPRESSION',
      SQLiteDBBackup.DEFAULT_CRON_EXPRESSION,
    );
    const job = new CronJob(cronExpression, () => {
      this.backup();
    });

    this.logger.info('Scheduling SQLite database backup', {
      ...BOOTSTRAP_CONTEXT,
      cronExpression,
    });
    // schedule the job
    this.schedulerRegistry.addCronJob(SQLiteDBBackup.JOB_NAME, job);
    job.start();
  }

  public register(db: SQLiteDB): void {
    const options = db.getOptions();
    this.logger.debug('Registering SQLite backup', {
      ...BOOTSTRAP_CONTEXT,
      name: options.name,
      dbFilename: options.dbFilename,
    });
    this.dbs.push(db);
  }

  private async backup(): Promise<void> {
    const context: Context = {
      correlationId: generateCorrelationId(SQLiteDBBackup.JOB_NAME),
    }
    for (const db of this.dbs) {
      try {
        await this.backupDB(db);
      } catch (error) {
        this.logger.error(
          'Failed to backup SQLite database', {
            ...context,
            dbFilename: db.getOptions().dbFilename,
          },
          error,
        );
      }
    }
  }

  private async backupDB(db: SQLiteDB): Promise<void> {
    const dbBackupFilename = path.resolve(
      this.backupDir,
      `${db.getOptions().name}.sqlite`,
    );
    await db.backup(dbBackupFilename);
  }
}