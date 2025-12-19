import * as path from 'path';
import * as fs from 'fs';
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';
import {
  InternalError,
  MealzError,
  parsePropertiesFromEnv,
  requireStrEnv,
  validatePropertiesFromEnv,
} from '@mealz/backend-common';
import { getLogger } from '@mealz/backend-logger';
import {
  BackupJobDef,
  backupJobDef,
  CopyBackupJob,
  SCPBackupJob,
  SCPBackupJobConfig,
} from '@mealz/backend-backup';

import {
  SQLITE_DUMP_DIR_ENV_NAME,
  SQLITE_LOCAL_BACKUP_DIR_ENV_NAME,
  SQLITE_REMOTE_BACKUP_ENV_NAME,
} from '../const';

export class BackupJobDefsResolver {
  public static resolveBackupJobs(): BackupJobDef<any>[] {
    const srcDir = path.resolve(requireStrEnv(SQLITE_DUMP_DIR_ENV_NAME));
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

      // remote copy
      if (envName.startsWith(SQLITE_REMOTE_BACKUP_ENV_NAME)) {
        const cfg = this.parseSCPBackupJobConfig(
          srcDir,
          envName,
          process.env[envName],
        );
        getLogger().info('Adding SQLiteDB remote backup', {
          ...BOOTSTRAP_CONTEXT,
          envName,
          config: cfg,
        })
        jobDefs.push(backupJobDef(
          envName,
          SCPBackupJob,
          cfg,
        ));
      }
    }
    return jobDefs;
  }

  private static parseSCPBackupJobConfig(
    srcDir: string,
    envName: string,
    envValue: string,
  ): SCPBackupJobConfig {
    const HOST = 'host';
    const PORT = 'port';
    const USER = 'user';
    const PRIVATE_KEY = 'key';
    const DIR = 'dir';

    // parse
    const properties = parsePropertiesFromEnv(envValue);

    // validate
    validatePropertiesFromEnv(
      envName,
      properties,
      {
        required: [HOST, USER, PRIVATE_KEY, DIR],
        optional: [PORT],
      }
    );

    const privateKey = path.resolve(properties[PRIVATE_KEY]);
    if (!fs.existsSync(privateKey)) {
      throw new InternalError(
        `Private key file ${MealzError.quote(privateKey)} not found`,
      );
    }

    // build configuration
    return {
      srcDir,
      dstDir: properties[DIR],
      host: properties[HOST],
      port: properties[PORT] ? parseInt(properties[PORT]) : undefined,
      user: properties[USER],
      privateKey: properties[PRIVATE_KEY],
    };
  }
}