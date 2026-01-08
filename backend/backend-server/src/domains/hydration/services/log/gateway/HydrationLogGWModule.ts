import { Module } from '@nestjs/common';
import {
  HydrationLogAPIModule,
} from '@mealz/backend-hydration-log-service-api';

import { HydrationLogGWService } from './services';
import { HydrationLogGWController } from './controllers';

@Module({
  imports: [HydrationLogAPIModule.forRoot({})],
  providers: [HydrationLogGWService],
  controllers: [HydrationLogGWController],
})
export class HydrationLogGWModule {}