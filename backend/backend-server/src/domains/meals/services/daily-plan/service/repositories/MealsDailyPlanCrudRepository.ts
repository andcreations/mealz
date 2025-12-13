import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import {
  InjectDBRepository, 
  DBRepository, 
  Where, 
  Update,
} from '@mealz/backend-db';
import {
  MealDailyPlan,
  MealDailyPlanForCreation,
  MealDailyPlanForUpdate,
} from '@mealz/backend-meals-daily-plan-service-api';

import {
  MEALS_DAILY_PLAN_DB_NAME,
  MEAL_DAILY_PLAN_DB_ENTITY_NAME,
  MealDailyPlanDBEntity,
  MealDailyPlanDBMapper,
} from '../db';

@Injectable()
export class MealsDailyPlanCrudRepository {
  public constructor(
    @InjectDBRepository(
      MEALS_DAILY_PLAN_DB_NAME,
      MEAL_DAILY_PLAN_DB_ENTITY_NAME,
    )
    private readonly repository: DBRepository<MealDailyPlanDBEntity>,
    private readonly mapper: MealDailyPlanDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async readMany(
    userId: string,
    limit: number,
    context: Context,
  ): Promise<MealDailyPlan[]> {
    const query: Where<MealDailyPlanDBEntity> = {
      user_id: { $eq: userId },
    };
    const entities = await this.repository.find(
      query,
      { 
        limit,
        sort: [
          { createdAt: 'desc' },
        ],
      },
      context,
    );
    return entities.map(entity => this.mapper.fromEntity(entity));
  }

  public async findById(
    mealDailyPlanId: string,
    context: Context,
  ): Promise<MealDailyPlan | undefined> {
    const query: Where<MealDailyPlanDBEntity> = {
      id: { $eq: mealDailyPlanId },
    };
    const entity = await this.repository.findOne(query, {}, context);
    if (!entity) {
      return;
    }
    return this.mapper.fromEntity(entity);
  }

  public async create(
    mealDailyPlan: MealDailyPlanForCreation,
    context: Context,
  ): Promise<Pick<MealDailyPlan, 'id'>> {
    const entity = this.mapper.toEntity({
      ...mealDailyPlan,
      id: this.idGenerator(),
    });
    await this.repository.insert(
      {
        ...entity, 
        createdAt: Date.now()
      },
      context,
    );
    return { id: entity.id };
  }

  public async update(
    mealDailyPlan: MealDailyPlanForUpdate,
    context: Context,
  ): Promise<void> {
    const query: Where<MealDailyPlanDBEntity> = {
      id: { $eq: mealDailyPlan.id },
    };
    const entity = this.mapper.toEntity(mealDailyPlan);
    const update: Update<MealDailyPlanDBEntity> = {
      details: { $set: entity.details },
    };
    await this.repository.update(query, update, context);
  }
}