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
export class MealsLogCrudRepository {
  public constructor(
    @InjectDBRepository(MEALS_LOG_DB_NAME, MEAL_LOG_DB_ENTITY_NAME)
    private readonly repository: DBRepository<MealLogDBEntity>,
    private readonly mapper: MealLogDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async readById(
    id: string,
    context: Context,
  ): Promise<MealLog | undefined> {
    const query: Where<MealLogDBEntity> = { id: { $eq: id } };
    const entity = await this.repository.findOne(
      this.opName('readById'),
      query,
      {},
      context,
    );
    if (!entity) {
      return;
    }
    return this.mapper.fromEntity(entity);
  }

  public async readLatestByUserId(
    userId: string,
    context: Context,
  ): Promise<MealLog | undefined> {
    const query: Where<MealLogDBEntity> = { user_id: { $eq: userId } };
    const entity = await this.repository.findOne(
      this.opName('readLatestByUserId'),
      query,
      { 
        sort: [
          { logged_at: 'desc' },
        ],
      },
      context,
    );
    return this.mapper.fromEntity(entity);
  }

  public async readByUserIdAndDateRange(
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
    const entities = await this.repository.find(
      this.opName('readByUserIdAndDateRange'),
      query,
      {},
      context,
    );
    return entities.map(entity => this.mapper.fromEntity(entity));
  }
  
  public async create(
    mealLog: Omit<MealLog, 'id'>,
    context: Context,
  ): Promise<Pick<MealLog, 'id'>> {
    const id = this.idGenerator();
    const entity = this.mapper.toEntity({
      ...mealLog,
      id,
    });
    await this.repository.insert(
      this.opName('create'),
      entity,
      context,
    );
    return { id };
  }

  public async delete(
    id: string,
    context: Context,
  ): Promise<void> {
    const query: Where<MealLogDBEntity> = { id: { $eq: id } };
    await this.repository.delete(
      this.opName('delete'),
      query,
      context,
    );
  }

  public async upsert(
    mealLog: UpsertObject<MealLog, 'id'>,
    context: Context,
  ): Promise<Pick<MealLog, 'id'>> {
    const id = mealLog.id ?? this.idGenerator();
    const entity = this.mapper.toEntity({ ...mealLog, id });
    await this.repository.upsert(
      this.opName('upsert'),
      entity,
      context,
    );
    return { id };
  }

  private opName(name: string): string {
    return `${MealsLogCrudRepository.name}.${name}`;
  }
}