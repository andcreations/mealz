import { Provider } from '@nestjs/common';
import { CopyBackupJob } from './CopyBackupJob';

export const BACKUP_JOB_PROVIDERS: Provider[] = [
  CopyBackupJob,
]