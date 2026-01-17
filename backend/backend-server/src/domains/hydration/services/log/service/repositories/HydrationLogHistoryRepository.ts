import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  InjectDBRepository, 
  DBRepository,
  Where, 
} from '@mealz/backend-db';
import { HydrationLog } from '@mealz/backend-hydration-log-service-api';

import {
  HYDRATION_LOG_DB_NAME,
  HYDRATION_LOG_DB_ENTITY_NAME,
  HydrationLogDBEntity,
  HydrationLogDBMapper,
} from '../db';

@Injectable()
export class HydrationLogHistoryRepository {
  public constructor(
    @InjectDBRepository(
      HYDRATION_LOG_DB_NAME,
      HYDRATION_LOG_DB_ENTITY_NAME,
    )
    private readonly repository: DBRepository<HydrationLogDBEntity>,
    private readonly mapper: HydrationLogDBMapper,
  ) {}

  public async readByDateRange(
    userId: string,
    fromDate: number,
    toDate: number,
    context: Context,
  ): Promise<HydrationLog[]> {
    const query: Where<HydrationLogDBEntity> = {
      user_id: { $eq: userId },
      logged_at: {
        $gte: fromDate,
        $lte: toDate,
      },
    };
    const entities = await this.repository.find(
      this.opName('readByDateRange'),
      query,
      {},
      context,
    );
    return entities.map(entity => this.mapper.fromEntity(entity));
  }

  private opName(name: string): string {
    return `${HydrationLogHistoryRepository.name}.${name}`;
  }
}