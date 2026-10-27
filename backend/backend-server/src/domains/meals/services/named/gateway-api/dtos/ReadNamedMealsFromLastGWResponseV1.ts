import { GWUpdatedAt } from '@mealz/backend-gateway-api';
import { GWNamedMeal } from '../types';

export interface ReadNamedMealsFromLastGWResponseV1 {
  namedMeals: (GWNamedMeal & GWUpdatedAt)[];
}