import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import {
  DBRepository,
  InjectDBRepository,
  Update,
  UpdateObject,
  Where,
} from '@mealz/backend-db';
import {
  NamedMeal,
  NamedMealWithoutId,
} from '@mealz/backend-meals-named-service-api';

import { 
  MEALS_NAMED_DB_ENTITY_NAME, 
  MEALS_NAMED_DB_NAME, 
  NamedMealDBEntity,
  NamedMealDBMapper,
} from '../db';

@Injectable()
export class MealsNamedCrudRepository {
  public constructor(
    @InjectDBRepository(MEALS_NAMED_DB_NAME, MEALS_NAMED_DB_ENTITY_NAME)
    private readonly repository: DBRepository<NamedMealDBEntity>,
    private readonly mapper: NamedMealDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async readById(
    id: string,
    context: Context,
  ): Promise<NamedMeal | undefined> {
    const query: Where<NamedMealDBEntity> = { id: { $eq: id } };
    const entity = await this.repository.findOne(query, {}, context);
    if (!entity) {
      return;
    }
    return this.mapper.fromEntity(entity);
  }

  public async readByUserIdAndMealName(
    userId: string,
    mealName: string,
    context: Context,
  ): Promise<NamedMeal | undefined> {
    const query: Where<NamedMealDBEntity> = {
      user_id: { $eq: userId },
      meal_name: { $eq: mealName },
    };
    const entity = await this.repository.findOne(query, {}, context);
    return this.mapper.fromEntity(entity);
  }

  public async readFromLastByUserId(
    lastId: string | undefined,
    limit: number,
    userId: string,
    context: Context,
  ): Promise<NamedMeal[]> {
    const query: Where<NamedMealDBEntity> = { user_id: { $eq: userId } };
    if (lastId) {
      query.id = { $gt: lastId };
    }
    const entities = await this.repository.find(
      query,
      { 
        limit,
        sort: [
          { id: 'asc' },
        ],
      },
      context,
    );
    return this.mapper.fromEntities(entities);
  }

  public async create(
    namedMeal: NamedMealWithoutId,
    context: Context,
  ): Promise<Pick<NamedMeal, 'id'>> {
    const id = this.idGenerator();
    const entity = this.mapper.toEntity({ ...namedMeal, id });
    await this.repository.insert(entity, context);
    return { id };
  }

  public async deleteById(
    id: string,
    context: Context,
  ): Promise<void> {
    const query: Where<NamedMealDBEntity> = { id: { $eq: id } };
    await this.repository.delete(query, context);
  }

  public async update(
    namedMeal: UpdateObject<NamedMeal, 'id'>,
    context: Context,
  ): Promise<void> {
    const query: Where<NamedMealDBEntity> = {
      id: { $eq: namedMeal.id },
    };
    const update: Update<NamedMealDBEntity> = {
      meal_name: { $set: namedMeal.mealName },
    };
    await this.repository.update(query, update, context);
  }
}