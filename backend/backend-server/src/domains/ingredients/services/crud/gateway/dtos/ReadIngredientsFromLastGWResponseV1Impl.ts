import { GWIngredientImpl } from '@mealz/backend-ingredients-gateway-common';
import {
    ReadIngredientsFromLastGWResponseV1,
} from "@mealz/backend-ingredients-crud-gateway-api";

export class ReadIngredientsFromLastGWResponseV1Impl
  implements ReadIngredientsFromLastGWResponseV1
{
  public ingredients: GWIngredientImpl[];
}