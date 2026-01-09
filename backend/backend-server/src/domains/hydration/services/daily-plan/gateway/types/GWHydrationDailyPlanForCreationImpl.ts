import { OmitType } from '@nestjs/swagger';
import { 
  GWHydrationDailyPlanForCreation,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

import { GWHydrationDailyPlanImpl } from './GWHydrationDailyPlanImpl';

export class GWHydrationDailyPlanForCreationImpl extends
  OmitType(GWHydrationDailyPlanImpl, ['id', 'createdAt'] as const)
  implements GWHydrationDailyPlanForCreation
{}