import { OmitType } from '@nestjs/swagger';
import { 
  GWMealDailyPlanForUpdate,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { GWMealDailyPlanImpl } from './GWMealDailyPlanImpl';

export class GWMealDailyPlanForUpdateImpl
  extends OmitType(GWMealDailyPlanImpl, ['id', 'createdAt'] as const)
  implements GWMealDailyPlanForUpdate
{}