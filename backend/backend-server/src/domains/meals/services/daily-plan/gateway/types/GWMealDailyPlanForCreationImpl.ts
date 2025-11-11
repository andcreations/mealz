import { OmitType } from '@nestjs/swagger';
import { 
  GWMealDailyPlanForCreation,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { GWMealDailyPlanImpl } from './GWMealDailyPlanImpl';

export class GWMealDailyPlanForCreationImpl extends
  OmitType(GWMealDailyPlanImpl, ['id', 'createdAt'] as const)
  implements GWMealDailyPlanForCreation
{}