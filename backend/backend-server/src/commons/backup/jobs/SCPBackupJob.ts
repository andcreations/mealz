import { Injectable, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DateTime } from 'luxon';
import { Client } from 'node-scp';
import { resolveTimeZone } from '@mealz/backend-common';

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
  private cfg: SCPBackupJobConfig;
  private privateKeyContent: string;

  public async init(id: string, cfg: SCPBackupJobConfig): Promise<void> {
    await super.init(id, cfg);
    this.cfg = cfg;
    this.privateKeyContent = fs.readFileSync(this.cfg.privateKey, 'utf8');
  }

  public async run(): Promise<void> {
    const client = await Client({
      host: this.cfg.host,
      port: this.cfg.port ?? 22,
      username: this.cfg.user,
      privateKey: this.privateKeyContent,
    });

    // destination directory
    const dstDir = this.resolveDstDir();
    await client.mkdir(dstDir, null, { recursive: true });

    // upload
    await client.uploadDir(this.cfg.srcDir, dstDir);
  }

  private resolveDstDir(): string {
    const dirName = DateTime
      .now()
      .setZone(resolveTimeZone())
      .toFormat('yyyy-MM-dd_HH-mm-ss');
    return path.join(this.cfg.dstDir, dirName);
  }
}