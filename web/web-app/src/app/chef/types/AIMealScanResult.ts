import { GWMacros } from '@mealz/backend-meals-log-gateway-api';

export interface AIMealScanResult {
  nameOfAllMeals: string;
  weightOfAllMeals: number;
  macros: GWMacros;
}