export const INGREDIENTS_CRUD_URL = '/api/ingredients/crud';

export interface IngredientsCrudAPIURL {
  readManyV1: (lastId?: string, limit?: number) => string;
}

export class IngredientsCrudAPI {
  static readonly url: IngredientsCrudAPIURL = {
    /**
     * @method GET
     * @param lastId Identifier of the last ingredient read.
     * @param limit Number of ingredients to read.
     * @response ReadManyIngredientsGWResponseV1
     */
    readManyV1: (lastId?: string, limit?: number) => {
      return `${INGREDIENTS_CRUD_URL}/many/v1?lastId=${lastId}&limit=${limit}`;
    },
  };
}