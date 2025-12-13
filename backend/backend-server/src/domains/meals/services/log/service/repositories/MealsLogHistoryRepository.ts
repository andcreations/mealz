import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  InjectDBRepository,
  DBRepository,
  Where,
} from '@mealz/backend-db';
import { MealLog } from '@mealz/backend-meals-log-service-api';

import {
  MEALS_LOG_DB_NAME,
  MEAL_LOG_DB_ENTITY_NAME,
  MealLogDBEntity,
  MealLogDBMapper,
} from '../db'

@Injectable()
export class MealsLogHistoryRepository {
  public constructor(
    @InjectDBRepository(MEALS_LOG_DB_NAME, MEAL_LOG_DB_ENTITY_NAME)
    private readonly repository: DBRepository<MealLogDBEntity>,
    private readonly mapper: MealLogDBMapper,
  ) {}

  public async readByDateRange(
    userId: string,
    fromDate: number,
    toDate: number,
    context: Context,
  ): Promise<MealLog[]> {
    const query: Where<MealLogDBEntity> = {
      user_id: { $eq: userId },
      logged_at: {
        $gte: fromDate,
        $lte: toDate,
      },
    };
    const entities = await this.repository.find(query, {}, context);
    return entities.map(entity => this.mapper.fromEntity(entity));
  }
}