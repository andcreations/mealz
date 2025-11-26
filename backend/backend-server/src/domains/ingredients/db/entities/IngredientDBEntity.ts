import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const INGREDIENT_DB_ENTITY_NAME = 'ingredient';
export const INGREDIENT_DB_TABLE_NAME = 'ingredients';

@DBEntity(INGREDIENT_DB_ENTITY_NAME)
export class IngredientDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
  })
  public id: string;

  @DBField({
    name: 'details_version',
    type: DBFieldType.INTEGER,
  })
  public details_version: number;

  @DBField({
    name: 'details',
    type: DBFieldType.BINARY,
  })
  public details: Buffer;
}