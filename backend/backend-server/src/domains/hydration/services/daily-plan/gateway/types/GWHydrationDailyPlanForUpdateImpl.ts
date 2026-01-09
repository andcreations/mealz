import { OmitType } from '@nestjs/swagger';
import { 
  GWHydrationDailyPlanForUpdate,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

import { GWHydrationDailyPlanImpl } from './GWHydrationDailyPlanImpl';

export class GWHydrationDailyPlanForUpdateImpl
  extends OmitType(GWHydrationDailyPlanImpl, ['id', 'createdAt'] as const)
  implements GWHydrationDailyPlanForUpdate
{}