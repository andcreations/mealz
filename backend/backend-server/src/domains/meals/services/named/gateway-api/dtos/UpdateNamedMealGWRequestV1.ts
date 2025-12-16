import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';

export interface UpdateNamedMealGWRequestV1 {
  mealName: string;
  meal: GWMealWithoutId;
}