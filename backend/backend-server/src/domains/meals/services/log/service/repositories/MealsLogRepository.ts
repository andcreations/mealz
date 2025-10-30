import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import {
  InjectDBRepository,
  DBRepository,
  Where,
  UpsertObject,
} from '@mealz/backend-db';
import { MealLog } from '@mealz/backend-meals-log-service-api';

import {
  MEALS_LOG_DB_NAME,
  MEAL_LOG_DB_ENTITY_NAME,
  MealLogDBEntity,
  MealLogDBMapper
} from '../db'

@Injectable()
export class MealsLogRepository {
  public constructor(
    @InjectDBRepository(MEALS_LOG_DB_NAME, MEAL_LOG_DB_ENTITY_NAME)
    private readonly repository: DBRepository<MealLogDBEntity>,
    private readonly mapper: MealLogDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async readMealLogById(
    id: string,
    context: Context,
  ): Promise<MealLog | undefined> {
    const query: Where<MealLogDBEntity> = { id: { $eq: id } };
    const entity = await this.repository.findOne(query, {}, context);
    if (!entity) {
      return;
    }
    return this.mapper.fromEntity(entity);
  }

  public async readLatestMealLogByUserId(
    userId: string,
    context: Context,
  ): Promise<MealLog | undefined> {
    const query: Where<MealLogDBEntity> = { userId: { $eq: userId } };
    const entity = await this.repository.findOne(
      query,
      { 
        sort: [
          { loggedAt: 'desc' },
        ],
      },
      context,
    );
    return this.mapper.fromEntity(entity);
  }
  
  public async createMealLog(
    mealLog: Omit<MealLog, 'id'>,
    context: Context,
  ): Promise<Pick<MealLog, 'id'>> {
    const id = this.idGenerator();
    const entity = this.mapper.toEntity({
      ...mealLog,
      id,
    });
    await this.repository.insert(entity, context);
    return { id };
  }

  public async deleteMealLogById(
    id: string,
    context: Context,
  ): Promise<void> {
    const query: Where<MealLogDBEntity> = { id: { $eq: id } };
    await this.repository.delete(query, context);
  }

  public async upsertMealLog(
    userMeal: UpsertObject<MealLog, 'id'>,
    context: Context,
  ): Promise<Pick<MealLog, 'id'>> {
    const id = userMeal.id ?? this.idGenerator();
    const entity = this.mapper.toEntity({ ...userMeal, id });
    await this.repository.upsert(entity, context);
    return { id };
  }  
}