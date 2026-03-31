import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import { InjectDBRepository, DBRepository } from '@mealz/backend-db';
import { ActionStatus } from '@mealz/backend-actions-manager-service-api';

import {
  ACTION_DB_ENTITY_NAME,
  ACTIONS_MANAGER_DB_NAME,
  ActionDBEntity,
  ActionDBMapper,
} from '../db';

@Injectable()
export class ActionCrudRepository {
  public constructor(
    @InjectDBRepository(
      ACTIONS_MANAGER_DB_NAME,
      ACTION_DB_ENTITY_NAME,
    )
    private readonly repository: DBRepository<ActionDBEntity>,
    private readonly mapper: ActionDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async create(
    topic: string,
    payload: unknown,
    context: Context,
  ): Promise<void> {
    const id = this.idGenerator();
    const entity = this.mapper.toEntity({
      id,
      topic,
      payload,
      status: ActionStatus.Pending,
      createdAt: Date.now(),
    });
    await this.repository.insert(
      this.opName('logHydrationV1'),
      entity,
      context,
    );
  }

  private opName(name: string): string {
    return `${ActionCrudRepository.name}.${name}`;
  }
}