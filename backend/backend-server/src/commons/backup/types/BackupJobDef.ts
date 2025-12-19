import { Type } from '@nestjs/common';
import { BackupJob } from './BackupJob';

type BackupJobType = Type<BackupJob<any>>;

export type CfgOfBackupJob<TJob extends BackupJobType> =
  TJob extends Type<BackupJob<infer TCfg>> ? TCfg : never;

export type BackupJobDef<TJob extends BackupJobType> = {
  id: string;
  clazz: TJob;
  cfg: CfgOfBackupJob<TJob>;
}

export function backupJobDef<TJob extends BackupJobType>(
  id: string,
  job: TJob,
  cfg: CfgOfBackupJob<TJob>,
): BackupJobDef<TJob> {
  return {
    id,
    clazz: job,
    cfg,
  };
}