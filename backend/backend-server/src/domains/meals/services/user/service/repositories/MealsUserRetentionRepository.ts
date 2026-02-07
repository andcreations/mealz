import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  InjectDBRepository,
  DBRepository,
  Where,
} from '@mealz/backend-db';

import {
  MEALS_USER_DB_NAME,
  USER_MEAL_DB_ENTITY_NAME,
  UserMealDBEntity,
} from '../db'

@Injectable()
export class MealsUserRetentionRepository {
  public constructor(
    @InjectDBRepository(MEALS_USER_DB_NAME, USER_MEAL_DB_ENTITY_NAME)
    private readonly repository: DBRepository<UserMealDBEntity>,
  ) {}

  public async readCreatedBefore(
    createdAt: number,
    lastId: string | undefined,
    limit: number,
    context: Context,
  ): Promise<UserMealForDeletion[]> {
    const query: Where<UserMealDBEntity> = {
      created_at: { $lt: createdAt },
    };
    if (lastId) {
      query.id = { $gt: lastId };
    }
    const entities = await this.repository.find(
      this.opName('readCreatedBefore'),
      query,
      {
        limit,
        sort: [
          { created_at: 'asc' },
        ],
      },
      context,
    );
    return entities.map(entity => {
      return {
        id: entity.id,
        mealId: entity.meal_id,
      };
    });
  }

  public async deleteById(
    id: string,
    context: Context,
  ): Promise<void> {
    await this.repository.delete(
      this.opName('deleteById'),
      { id: { $eq: id } },
      context,
    );
  }

  private opName(name: string): string {
    return `${MealsUserRetentionRepository.name}.${name}`;
  }
}

export interface UserMealForDeletion {
  id: string;
  mealId: string;
}