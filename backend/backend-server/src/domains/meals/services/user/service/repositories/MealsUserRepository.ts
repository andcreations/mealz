import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator  } from '@mealz/backend-common';
import { InjectDBRepository, DBRepository, Where } from '@mealz/backend-db';
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

  public async createUserMeal(
    userMeal: Omit<UserMeal, 'id'>,
    context: Context,
  ): Promise<Pick<UserMeal, 'id'>> {
    const id = this.idGenerator();
    const entity = this.mapper.toEntity({
      ...userMeal,
      id,
    });
    await this.repository.insert(entity, context);
    return { id };
  }

  public async deleteUserMealById(
    id: string,
    context: Context,
  ): Promise<void> {
    const query: Where<UserMealDBEntity> = { id: { $eq: id } };
    await this.repository.delete(query, context);
  }
}