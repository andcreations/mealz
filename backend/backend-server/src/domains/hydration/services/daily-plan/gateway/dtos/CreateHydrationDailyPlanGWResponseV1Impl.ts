import { ApiProperty } from '@nestjs/swagger';
import { 
  CreateHydrationDailyPlanGWResponseV1,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

export class CreateHydrationDailyPlanGWResponseV1Impl
  implements CreateHydrationDailyPlanGWResponseV1
{
  @ApiProperty({
    description: 'Daily plan identifier',
  })
  public id: string;
} 