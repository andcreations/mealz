import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator  } from '@mealz/backend-common';
import {
  InjectDBRepository, 
  DBRepository,
  Where,
  UpsertObject,
} from '@mealz/backend-db';
import { Meal } from '@mealz/backend-meals-common';
import {
  MEALS_DB_NAME,
  MEAL_DB_ENTITY_NAME,
  MealDBEntity,
  MealDBMapper,
} from '@mealz/backend-meals-db';

@Injectable()
export class MealsCrudRepository {
  public constructor(
    @InjectDBRepository(MEALS_DB_NAME, MEAL_DB_ENTITY_NAME)
    private readonly repository: DBRepository<MealDBEntity>,
    private readonly mapper: MealDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async readMealById(
    id: string,
    context: Context,
  ): Promise<Meal | undefined> {
    const query: Where<MealDBEntity> = { id: { $eq: id } };
    const entity = await this.repository.findOne(query, {}, context);
    if (!entity) {
      return;
    }
    return this.mapper.fromEntity(entity);
  }

  public async readMealsById(
    ids: string[],
    context: Context,
  ): Promise<Meal[]> {
    return [];
  }

  public async createMeal(
    meal: Omit<Meal, 'id'>,
    context: Context,
  ): Promise<Pick<Meal,'id'>> {
    const id = this.idGenerator();
    const entity = this.mapper.toEntity({
      id,
      ...meal,
    });

    await this.repository.insert(entity, context);
    return { id };
  }

  public async upsertMeal(
    meal: UpsertObject<Meal, 'id'>,
    context: Context,
  ): Promise<Pick<Meal, 'id'>> {
    const id = meal.id ?? this.idGenerator();
    const entity = this.mapper.toEntity({ ...meal, id });
    await this.repository.upsert(entity, context);
    return { id };
  }

  public async deleteMealById(
    id: string,
    context: Context,
  ): Promise<void> {
    const query: Where<MealDBEntity> = { id: { $eq: id } };
    await this.repository.delete(query, context);
  }
}