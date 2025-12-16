import { MealWithoutId } from '@mealz/backend-meals-common';

export interface CreateNamedMealRequestV1 {
  userId: string;
  meal: MealWithoutId;
  mealName: string;
}