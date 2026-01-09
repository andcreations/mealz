import { OmitType } from '@nestjs/swagger';
import { 
  GWHydrationLogForUpdate,
} from '@mealz/backend-hydration-log-gateway-api';

import { GWHydrationLogImpl } from './GWHydrationLogImpl';

export class GWHydrationLogForUpdateImpl
  extends OmitType(GWHydrationLogImpl, ['id', 'loggedAt'] as const)
  implements GWHydrationLogForUpdate
{}