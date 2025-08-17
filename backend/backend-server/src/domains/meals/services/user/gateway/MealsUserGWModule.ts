import { Module } from '@nestjs/common';

import { MealsUserGWService } from './services';
import { MealsUserGWController } from './controllers';

@Module({
  providers: [MealsUserGWService],
  controllers: [MealsUserGWController],
})
export class MealsUserGWModule {
}