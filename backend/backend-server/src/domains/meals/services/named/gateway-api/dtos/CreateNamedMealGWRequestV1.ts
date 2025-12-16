import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';

export interface CreateNamedMealGWRequestV1 {
  mealName: string;
  meal: GWMealWithoutId;
}