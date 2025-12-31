import { GWMacros } from '@mealz/backend-meals-log-gateway-api';

export interface GWMacrosWithDayOfWeek extends GWMacros {
  dayOfWeek: string;
}