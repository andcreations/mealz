import { Injectable, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DateTime } from 'luxon';
import { Client, ScpClient } from 'node-scp';
import { TimePeriod } from '@andcreations/common';
import { Context, generateCorrelationId } from '@mealz/backend-core';
import { resolveTimeZone } from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';

import { BackupJob } from '../types';

export interface SCPBackupJobConfig {
  srcDir: string;
  dstDir: string;
  host: string;
  port?: number;
  user: string;
  privateKey: string;
}

@Injectable({ scope: Scope.TRANSIENT })
export class SCPBackupJob extends BackupJob<SCPBackupJobConfig> {
  private static readonly RETENTION_PERIOD = '30d';
  private static readonly FILE_FORMAT = 'yyyy-MM-dd_HH-mm-ss';

  private readonly retentionInMills = TimePeriod.fromStr(
    SCPBackupJob.RETENTION_PERIOD,
  );
  private cfg: SCPBackupJobConfig;
  private privateKeyContent: string;

  public constructor(private readonly logger: Logger) {
    super();
  }

  public async init(id: string, cfg: SCPBackupJobConfig): Promise<void> {
    await super.init(id, cfg);
    this.cfg = cfg;
    this.privateKeyContent = fs.readFileSync(this.cfg.privateKey, 'utf8');
  }

  public async run(): Promise<void> {
    const context: Context = {
      correlationId: generateCorrelationId('scp-backup'),
    };

    const client = await Client({
      host: this.cfg.host,
      port: this.cfg.port ?? 22,
      username: this.cfg.user,
      privateKey: this.privateKeyContent,
    });

    // destination directory
    const dstDir = this.resolveDstDir();
    await client.mkdir(dstDir, null, { recursive: true });


    // log
    this.logger.info('Uploading backup', {
      ...context,
      srcDir: this.cfg.srcDir,
      dstDir: dstDir,
    });

    // upload
    await client.uploadDir(this.cfg.srcDir, dstDir);

    // delete old backups
    await this.deleteOldBackups(client, context);
  }

  private resolveDstDir(): string {
    const dirName = DateTime
      .now()
      .setZone(resolveTimeZone())
      .toFormat(SCPBackupJob.FILE_FORMAT);
    return path.join(this.cfg.dstDir, dirName);
  }

  private async deleteOldBackups(
    client: ScpClient,
    context: Context,
  ): Promise<void> {
    this.logger.debug('Deleting old SCP backups', {
      ...context,
      dir: this.cfg.dstDir,
    });

    // for each file
    const files = await client.list(this.cfg.dstDir);
    for (const file of files) {
      const fileName = file.name;
      const stat = await client.stat(path.join(this.cfg.dstDir, fileName));

      // skip if not a directory
      if (!stat.isDirectory()) {
        continue;
      }

      // get date from directory name
      const date = DateTime.fromFormat(
        fileName,
        SCPBackupJob.FILE_FORMAT,
        { zone: resolveTimeZone() }
      );

      // delete if older than retention period
      const timeDiff = -date.diffNow().toMillis();
      if (timeDiff > this.retentionInMills) {
        const backupDir = path.join(this.cfg.dstDir, fileName);
        this.logger.debug('Deleting old SCP backup', {
          ...context,
          backupDir,
        });

        // delete
        try {
          await client.rmdir(backupDir);
        } catch (error) {
          this.logger.error(
            'Error deleting old SCP backup',
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