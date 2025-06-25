import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BOOTSTRAP_CONTEXT } from '#mealz/backend-core';
import { Logger } from '#mealz/backend-logger';

import { getDBEntitySpec, getDBFieldSpec } from '../../core/spec';
import { DBRepository } from '../../core/repositories';
import { SQLiteDBRepository } from '../repositories';

interface RepositoryEntry {
  entityName: string;
  tableName: string;
  repository: SQLiteDBRepository<unknown>;
}

@Injectable()
export class SQLiteDBRepositoryFactory implements OnModuleInit {
  private readonly entries: RepositoryEntry[] = [];

  public constructor(
    private readonly logger: Logger,
    private readonly moduleRef: ModuleRef,
  ) {}

  public async onModuleInit(): Promise<void> {
  // initialize repositories
    for (const entry of this.entries) {
      const entitySpec = getDBEntitySpec(entry.entityName);
      const fieldsSpec = getDBFieldSpec(entitySpec.clazz);
      await entry.repository.initSQLiteDBRepository(
        entry.tableName,
        entitySpec,
        fieldsSpec,
      );

      this.logger.debug('Initialized DB repository', {
        ...BOOTSTRAP_CONTEXT,
        entity: entry.entityName,
      });
  
    }
  }

  public async createRepository(
    entityName: string,
    tableName: string,
  ): Promise<DBRepository<unknown>> {
  // create
    const repository = await this.moduleRef.create(SQLiteDBRepository);

  // keep for initialization
    this.entries.push({
      entityName,
      tableName,
      repository,
    });
    return repository;
  }
}