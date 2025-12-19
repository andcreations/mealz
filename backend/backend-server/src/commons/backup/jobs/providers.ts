import { Provider } from '@nestjs/common';

import { CopyBackupJob } from './CopyBackupJob';
import { SCPBackupJob } from './SCPBackupJob';

export const BACKUP_JOB_PROVIDERS: Provider[] = [
  CopyBackupJob,
  SCPBackupJob,
]