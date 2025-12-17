import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';
import { GWNamedMeal } from '../types';

export interface ReadNamedMealByIdGWResponseV1 {
  namedMeal: GWNamedMeal;
  meal: GWMealWithoutId;
}