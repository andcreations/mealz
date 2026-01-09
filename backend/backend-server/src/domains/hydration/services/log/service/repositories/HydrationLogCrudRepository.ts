import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import {
  InjectDBRepository, 
  DBRepository, 
  Where, 
  Update,
} from '@mealz/backend-db';
import { GlassFraction } from '@mealz/backend-hydration-log-service-api';

import {
  HYDRATION_LOG_DB_NAME,
  HYDRATION_LOG_DB_ENTITY_NAME,
  HydrationLogDBEntity,
  HydrationLogDBMapper,
} from '../db';

@Injectable()
export class HydrationLogCrudRepository {
  public constructor(
    @InjectDBRepository(
      HYDRATION_LOG_DB_NAME,
      HYDRATION_LOG_DB_ENTITY_NAME,
    )
    private readonly repository: DBRepository<HydrationLogDBEntity>,
    private readonly mapper: HydrationLogDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async logHydrationV1(
    userId: string,
    glassFraction: GlassFraction,
    context: Context,
  ): Promise<void> {
    const id = this.idGenerator();
    const entity = this.mapper.toEntity({
      id,
      userId,
      glassFraction,
      loggedAt: Date.now(),
    });
    await this.repository.insert(entity, context);
  }
}