import { GWMacros } from '@mealz/backend-meals-log-gateway-api';

export interface AIMealScanIngredient {
  name: string;
  weightInGrams: number;
  macros: GWMacros;
}