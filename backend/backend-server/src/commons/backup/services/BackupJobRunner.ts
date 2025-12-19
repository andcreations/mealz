import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';

import { BackupJob, BackupJobDef } from '../types';

@Injectable()
export class BackupJobRunner implements OnModuleInit {
  private readonly jobs: Array<BackupJob<any>> = [];

  public constructor(
    private readonly moduleRef: ModuleRef,
    private readonly logger: Logger,
    private readonly jobDefs: Array<BackupJobDef<any>>,
  ) {}

  public async onModuleInit(): Promise<void> {
    for (const jobDef of this.jobDefs) {
      const job = await this.moduleRef.resolve(jobDef.clazz);
      await job.init(jobDef.id, jobDef.cfg);
      this.jobs.push(job);
    }
  }

  public async runAll(context: Context): Promise<void> {
    for (const job of this.jobs) {
      this.logger.info('Running backup job', {
        ...context,
        jobId: job.getId(),
      });
      await job.run();
    }
  }
}