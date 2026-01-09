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
  HydrationDailyPlan,
  HydrationDailyPlanForCreation,
  HydrationDailyPlanForUpdate,
} from '@mealz/backend-hydration-daily-plan-service-api';

import {
  HYDRATION_DAILY_PLAN_DB_NAME,
  HYDRATION_DAILY_PLAN_DB_ENTITY_NAME,
  HydrationDailyPlanDBEntity,
  HydrationDailyPlanDBMapper,
} from '../db';

@Injectable()
export class HydrationDailyPlanCrudRepository {
  public constructor(
    @InjectDBRepository(
      HYDRATION_DAILY_PLAN_DB_NAME,
      HYDRATION_DAILY_PLAN_DB_ENTITY_NAME,
    )
    private readonly repository: DBRepository<HydrationDailyPlanDBEntity>,
    private readonly mapper: HydrationDailyPlanDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async findById(
    hydrationDailyPlanId: string,
    context: Context,
  ): Promise<HydrationDailyPlan | undefined> {
    const query: Where<HydrationDailyPlanDBEntity> = {
      id: { $eq: hydrationDailyPlanId },
    };
    const entity = await this.repository.findOne(query, {}, context);
    return this.mapper.fromEntity(entity);
  }

  public async create(
    hydrationDailyPlan: HydrationDailyPlanForCreation,
    context: Context,
  ): Promise<Pick<HydrationDailyPlan, 'id'>> {
    const entity = this.mapper.toEntity({
      ...hydrationDailyPlan,
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
    hydrationDailyPlan: HydrationDailyPlanForUpdate,
    context: Context,
  ): Promise<void> {
    const query: Where<HydrationDailyPlanDBEntity> = {
      id: { $eq: hydrationDailyPlan.id },
    };
    const entity = this.mapper.toEntity(hydrationDailyPlan);
    const update: Update<HydrationDailyPlanDBEntity> = {
      details: { $set: entity.details },
    };
    await this.repository.update(query, update, context);
  }
}