import { MealWithoutId } from '@mealz/backend-meals-common';

export interface UpdateNamedMealRequestV1 {
  namedMealId: string;
  userId: string;
  meal: MealWithoutId;
  mealName: string;
}