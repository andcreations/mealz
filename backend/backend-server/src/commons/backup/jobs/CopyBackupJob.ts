import { Injectable, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DateTime } from 'luxon';
import { copyFile } from 'copy-file';
import { InternalError, MealzError, resolveTimeZone } from '@mealz/backend-common';

import { BackupJob } from '../types';

export interface CopyBackupJobConfig {
  srcDir: string;
  dstDir: string;
}

@Injectable({ scope: Scope.TRANSIENT })
export class CopyBackupJob extends BackupJob<CopyBackupJobConfig> {
  private cfg: CopyBackupJobConfig;

  public async init(id: string, cfg: CopyBackupJobConfig): Promise<void> {
    await super.init(id, cfg);
    this.cfg = cfg;
  }

  public async run(): Promise<void> {
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

    // copy
    const files = fs.readdirSync(this.cfg.srcDir);
    for (const file of files) {
      const srcFile = path.join(this.cfg.srcDir, file);
      const dstFile = path.join(dstDir, file);
      await copyFile(srcFile, dstFile);
    }
  }

  private resolveDstDir(): string {
    const dirName = DateTime
      .now()
      .setZone(resolveTimeZone())
      .toFormat('yyyy-MM-dd_HH-mm-ss');
    return path.join(this.cfg.dstDir, dirName);
  }
}