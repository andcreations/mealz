import { BackupJobDef } from './BackupJobDef';

export interface BackupModuleOptions {
  // use backupJobDef() to validate at the compile time
  jobs: Array<BackupJobDef<any>>;
}