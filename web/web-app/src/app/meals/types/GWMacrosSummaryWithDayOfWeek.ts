import { GWMacrosSummary } from '@mealz/backend-meals-log-gateway-api';

export interface GWMacrosSummaryWithDayOfWeek extends GWMacrosSummary {
  dayOfWeek: string;
}