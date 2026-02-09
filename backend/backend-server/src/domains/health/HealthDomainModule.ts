import { Module } from '@nestjs/common';
import { HealthGWModule } from './services/health';

@Module({
  imports: [
    HealthGWModule,
  ],
})
export class HealthDomainModule {}