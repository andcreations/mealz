import { OmitType } from '@nestjs/swagger';
import { 
  GWHydrationLogForCreation,
} from '@mealz/backend-hydration-log-gateway-api';

import { GWHydrationLogImpl } from './GWHydrationLogImpl';

export class GWHydrationLogForCreationImpl extends
  OmitType(GWHydrationLogImpl, ['id', 'loggedAt'] as const)
  implements GWHydrationLogForCreation
{}