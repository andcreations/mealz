import { Injectable } from '@nestjs/common';
import { Context } from '#mealz/backend-core';
import { InjectDBRepository, DBRepository, Where } from '#mealz/backend-db';
import { Ingredient } from '#mealz/backend-ingredients-common';
import {
  INGREDIENTS_DB_NAME,
  INGREDIENT_DB_ENTITY_NAME,
  IngredientDBEntity,
  IngredientDBMapper,
} from '#mealz/backend-ingredients-db';

@Injectable()
export class IngredientsSearchRepository {
  public constructor(
    @InjectDBRepository(INGREDIENTS_DB_NAME, INGREDIENT_DB_ENTITY_NAME)
    private readonly repository: DBRepository<IngredientDBEntity>,
    private readonly mapper: IngredientDBMapper,
  ) {}

  public async readFromLast(
    lastId: string | undefined,
    limit: number,
    context: Context,
  ): Promise<Ingredient[]> {
    const query: Where<IngredientDBEntity> = {};
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
    return entities.map(entity => this.mapper.fromEntity(entity));
  }
}