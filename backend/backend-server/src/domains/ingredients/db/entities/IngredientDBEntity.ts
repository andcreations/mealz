import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const INGREDIENT_DB_ENTITY_NAME = 'Ingredient';
export const INGREDIENT_DB_TABLE_NAME = 'Ingredients';

@DBEntity(INGREDIENT_DB_ENTITY_NAME)
export class IngredientDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
  })
  public id: string;

  @DBField({
    name: 'detailsVersion',
    type: DBFieldType.INTEGER,
  })
  public detailsVersion: number;

  @DBField({
    name: 'details',
    type: DBFieldType.BINARY,
  })
  public details: Buffer;
}