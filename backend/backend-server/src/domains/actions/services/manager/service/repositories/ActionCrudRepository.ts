import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import { InjectDBRepository, DBRepository, Update } from '@mealz/backend-db';
import { 
  Action,
  ActionStatus,
} from '@mealz/backend-actions-manager-service-api';

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
    domain: string,
    service: string,
    topic: string,
    payload: unknown,
    context: Context,
  ): Promise<Pick<Action, 'id' | 'status'>> {
    const id = this.idGenerator();
    const status = ActionStatus.Pending;
    const entity = this.mapper.toEntity({
      id,
      domain,
      service,
      topic,
      payload,
      status,
      createdAt: Date.now(),
    });
    await this.repository.insert(
      this.opName('create'),
      entity,
      context,
    );
    return { id, status };
  }

  public async read(
    id: string,
    context: Context,
  ): Promise<Action | undefined> {
    const entity = await this.repository.findOne(
      this.opName('read'),
      { id: { $eq: id } },
      {},
      context,
    );
    return this.mapper.fromEntity(entity);
  }

  public async updateStatus(
    id: string,
    status: ActionStatus,
    error: string | undefined,
    context: Context,
  ): Promise<void> {
    const update: Update<ActionDBEntity> = {
      status: { $set: status },
      error: { $set: error },
    };
    await this.repository.update(
      this.opName('updateStatus'),
      { id: { $eq: id } },
      update,
      context,
    );
  }

  private opName(name: string): string {
    return `${ActionCrudRepository.name}.${name}`;
  }
}