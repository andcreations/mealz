import { Module } from '@nestjs/common';
import { HealthGWController } from './controllers';

@Module({
  controllers: [
    HealthGWController,
  ],
})
export class HealthGWModule {}