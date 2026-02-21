import { GWMacros } from '@mealz/backend-meals-log-gateway-api';

export interface CalculatorResult {
  bmr: number;
  macros: GWMacros;
}