import { SQLiteDBBackup } from '../types';

export interface SQLiteDatabasesBackedUpEventV1 {
  // The directory where the backups are stored.
  backupDir: string;

  // The databases that were successfully backed up.
  successfulBackups: SQLiteDBBackup[];

  // The databases that failed to be backed up.
  failedBackups: SQLiteDBBackup[];
}