import { Injectable, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DateTime } from 'luxon';
import { copyFile } from 'copy-file';
import { rimraf } from 'rimraf'
import { TimePeriod } from '@andcreations/common';
import { Context, generateCorrelationId } from '@mealz/backend-core';
import {
  InternalError,
  MealzError,
  resolveTimeZone,
} from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';

import { BackupJob } from '../types';

export interface CopyBackupJobConfig {
  srcDir: string;
  dstDir: string;
}

@Injectable({ scope: Scope.TRANSIENT })
export class CopyBackupJob extends BackupJob<CopyBackupJobConfig> {
  private static readonly RETENTION_PERIOD = '30d';
  private static readonly FILE_FORMAT = 'yyyy-MM-dd_HH-mm-ss';

  private readonly retentionInMills = TimePeriod.fromStr(
    CopyBackupJob.RETENTION_PERIOD,
  );
  private cfg: CopyBackupJobConfig;


  public constructor(private readonly logger: Logger) {
    super();
    setTimeout(async () => {
      await this.deleteOldBackups({
        correlationId: generateCorrelationId('copy-backup'),
      });
    }, 1024);
  }

  public async init(id: string, cfg: CopyBackupJobConfig): Promise<void> {
    await super.init(id, cfg);
    this.cfg = cfg;
  }

  public async run(): Promise<void> {
    const context: Context = {
      correlationId: generateCorrelationId('copy-backup'),
    };

    // source directory
    if (!fs.existsSync(this.cfg.srcDir)) {
      throw new InternalError(
        `Source directory ${MealzError.quote(this.cfg.srcDir)} does not exist`
      );
    }

    // destination directory
    const dstDir = this.resolveDstDir();
    if (!fs.existsSync(dstDir)) {
      fs.mkdirSync(dstDir, { recursive: true });
    }

    // log
    
    this.logger.info('Copying backup', {
      ...context,
      srcDir: this.cfg.srcDir,
      dstDir: dstDir,
    });

    // copy
    const files = fs.readdirSync(this.cfg.srcDir);
    for (const file of files) {
      const srcFile = path.join(this.cfg.srcDir, file);
      const dstFile = path.join(dstDir, file);
      await copyFile(srcFile, dstFile);
    }

    // delete old backups
    await this.deleteOldBackups(context);
  }

  private resolveDstDir(): string {
    const dirName = DateTime
      .now()
      .setZone(resolveTimeZone())
      .toFormat(CopyBackupJob.FILE_FORMAT);
    return path.join(this.cfg.dstDir, dirName);
  }

  private async deleteOldBackups(context: Context): Promise<void> {
    this.logger.debug('Deleting old local backups', {
      ...context,
      dir: this.cfg.dstDir,
    });

    // for each file
    const files = fs.readdirSync(this.cfg.dstDir);
    for (const file of files) {
      const stat = fs.statSync(path.join(this.cfg.dstDir, file));

      // skip if not a directory
      if (!stat.isDirectory()) {
        continue;
      }

      // get date from directory name
      const date = DateTime.fromFormat(
        file,
        CopyBackupJob.FILE_FORMAT,
        { zone: resolveTimeZone() }
      );

      // delete if older than retention period
      const timeDiff = -date.diffNow().toMillis();
      if (timeDiff > this.retentionInMills) {
        const backupDir = path.join(this.cfg.dstDir, file);
        this.logger.debug('Deleting old local backup', {
          ...context,
          backupDir,
        });
        
        // delete
        try {
          await rimraf(backupDir);
        } catch (error) {
          this.logger.error(
            'Error deleting old local backup',
            {
              ...context,
              backupDir,
            },
            error,
          );
        }
      }
    }
  }
}