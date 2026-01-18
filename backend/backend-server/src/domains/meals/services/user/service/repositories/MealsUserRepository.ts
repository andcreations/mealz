import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import {
  InjectDBRepository,
  DBRepository,
  Where,
  UpsertObject,
} from '@mealz/backend-db';
import { UserMeal } from '@mealz/backend-meals-user-service-api';

import {
  MEALS_USER_DB_NAME,
  USER_MEAL_DB_ENTITY_NAME,
  UserMealDBEntity,
  UserMealDBMapper
} from '../db'

@Injectable()
export class MealsUserRepository {
  public constructor(
    @InjectDBRepository(MEALS_USER_DB_NAME, USER_MEAL_DB_ENTITY_NAME)
    private readonly repository: DBRepository<UserMealDBEntity>,
    private readonly mapper: UserMealDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async readUserMealById(
    id: string,
    context: Context,
  ): Promise<UserMeal | undefined> {
    const query: Where<UserMealDBEntity> = { id: { $eq: id } };
    const entity = await this.repository.findOne(
      this.opName('readUserMealById'),
      query,
      {},
      context,
    );
    if (!entity) {
      return;
    }
    return this.mapper.fromEntity(entity);
  }

  public async readUserMeal(
    userId: string,
    typeId: string,
    context: Context,
  ): Promise<UserMeal | undefined> {
    const query: Where<UserMealDBEntity> = {
      user_id: { $eq: userId },
      type_id: { $eq: typeId },
    };
    const entity = await this.repository.findOne(
      this.opName('readUserMeal'),
      query,
      {},
      context,
    );
    if (!entity) {
      return;
    }
    return this.mapper.fromEntity(entity);
  }

  public async readMany(
    lastId: string | undefined,
    limit: number,
    userId: string,
    typeIds: string[] | undefined,
    context: Context,
  ): Promise<UserMeal[]> {
    const query: Where<UserMealDBEntity> = {
      user_id: { $eq: userId },
    };
    if (lastId) {
      query.id = { $gt: lastId };
    }
    if (typeIds) {
      query.type_id = { $in: typeIds };
    }
    const entities = await this.repository.find(
      this.opName('readMany'),
      query,
      { 
        limit,
        sort: [
          { id: 'asc' },
        ],
      },
      context,
    );
    return entities.map(entity => this.mapper.fromEntity(entity));
  }

  public async createUserMeal(
    userMeal: Omit<UserMeal, 'id'>,
    context: Context,
  ): Promise<Pick<UserMeal, 'id'>> {
    const id = this.idGenerator();
    const entity = this.mapper.toEntity({
      ...userMeal,
      id,
    });
    await this.repository.insert(
      this.opName('createUserMeal'),
      entity,
      context,
    );
    return { id };
  }

  public async upsertUserMeal(
    userMeal: UpsertObject<UserMeal, 'id'>,
    context: Context,
  ): Promise<Pick<UserMeal, 'id'>> {
    const id = userMeal.id ?? this.idGenerator();
    const entity = this.mapper.toEntity({ ...userMeal, id });
    await this.repository.upsert(
      this.opName('upsertUserMeal'),
      entity,
      context,
    );
    return { id };
  }

  public async deleteUserMealById(
    id: string,
    context: Context,
  ): Promise<void> {
    const query: Where<UserMealDBEntity> = { id: { $eq: id } };
    await this.repository.delete(
      this.opName('deleteUserMealById'),
      query,
      context,
    );
  }

  public async deleteUserMeal(
    userId: string,
    typeId: string,
    context: Context,
  ): Promise<void> {
    const query: Where<UserMealDBEntity> = {
      user_id: { $eq: userId },
      type_id: { $eq: typeId },
    };
    await this.repository.delete(
      this.opName('deleteUserMeal'),
      query,
      context,
    );
  }

  private opName(name: string): string {
    return `${MealsUserRepository.name}.${name}`;
  }
}